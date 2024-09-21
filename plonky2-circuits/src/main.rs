use std::{fs::File, io::{BufReader, Write}, marker::PhantomData, time::Instant, usize};
use anyhow::{Error, Ok};
use plonky2::{field::{extension::{Extendable, FieldExtension}, packed::PackedField, polynomial::PolynomialValues, types::Field}, hash::hash_types::RichField, iop::{ext_target::ExtensionTarget, target::Target, witness::{PartialWitness, WitnessWrite}}, plonk::{circuit_builder::CircuitBuilder, circuit_data::CircuitConfig, config::{AlgebraicHasher, GenericConfig, PoseidonGoldilocksConfig}}};

fn main() -> Result<(), Error>{
    const D: usize = 2;
    type C = PoseidonGoldilocksConfig;
    type F = <C as GenericConfig<D>>::F;

    let config = CircuitConfig::standard_recursion_config();
    let mut builder = CircuitBuilder::<F,D>::new(config);

    // let neurons = builder.add_virtual_target();
    // let inputs = builder.add_virtual_target();
    let mut init = builder.zero();
    let weights: [Target;128] = builder.add_virtual_target_arr();
    let biases: [Target;8] = builder.add_virtual_target_arr();
    let pub_input: [Target;16] = builder.add_virtual_target_arr();
    let res = builder.add_virtual_target();
    for bias_index in 0..8{
        let mut current_sum = builder.zero();
        
        for weight_index in 0..16{
            let mul = builder.mul(pub_input[weight_index], weights[(8*weight_index)+bias_index]);
            current_sum = builder.add(current_sum, mul);
        }
        
        current_sum = builder.add(current_sum, biases[bias_index]);
        init = builder.add(init, current_sum);
    }
    builder.connect(res, init);

    builder.register_public_inputs(&pub_input);

    let mut pw = PartialWitness::new();
    let file = File::open("dense_3_1.json")?;
    let reader = BufReader::new(file);
    let public_inputs : Vec<F> = serde_json::from_reader(reader)?;
    pw.set_target_arr(&weights, &public_inputs[2..130]);
    pw.set_target_arr(&biases, &public_inputs[130..138]);
    pw.set_target_arr(&pub_input, &public_inputs[138..154]);
    pw.set_target(res, public_inputs[154]);

    
    let data = builder.build::<C>();
    let start = Instant::now();
    let proof = data.prove(pw)?;
    println!("Duration to generate proof :- {}", start.elapsed().as_millis());
    let mut json_data = serde_json::to_string(&proof)?;
    let mut file = File::create("proof.json")?;
    file.write_all(json_data.as_bytes())?;

    data.verify(proof)
}
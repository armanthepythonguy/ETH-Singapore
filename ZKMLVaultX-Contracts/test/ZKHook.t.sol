// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import {IHooks} from "v4-periphery/lib/v4-core/src/interfaces/IHooks.sol";
import {Hooks} from "v4-periphery/lib/v4-core/src/libraries/Hooks.sol";
import {TickMath} from "v4-periphery/lib/v4-core/src/libraries/TickMath.sol";
import {IPoolManager} from "v4-periphery/lib/v4-core/src/interfaces/IPoolManager.sol";
import {PoolKey} from "v4-periphery/lib/v4-core/src/types/PoolKey.sol";
import {BalanceDelta} from "v4-periphery/lib/v4-core/src/types/BalanceDelta.sol";
import {PoolId, PoolIdLibrary} from "v4-periphery/lib/v4-core/src/types/PoolId.sol";
import {CurrencyLibrary, Currency} from "v4-periphery/lib/v4-core/src/types/Currency.sol";
import {PoolSwapTest} from "v4-periphery/lib/v4-core/src/test/PoolSwapTest.sol";
import {ZKMLHook} from "../src/ZKHook.sol";
import {StateLibrary} from "v4-periphery/lib/v4-core/src/libraries/StateLibrary.sol";

import {LiquidityAmounts} from "v4-periphery/lib/v4-core/test/utils/LiquidityAmounts.sol";
import {IPositionManager} from "v4-periphery/src/interfaces/IPositionManager.sol";
import {EasyPosm} from "./utils/EasyPosm.sol";
import {Fixtures} from "./utils/Fixtures.sol";
import "forge-std/console.sol";

contract CounterTest is Test, Fixtures {
    using EasyPosm for IPositionManager;
    using PoolIdLibrary for PoolKey;
    using CurrencyLibrary for Currency;
    using StateLibrary for IPoolManager;

    ZKMLHook hook;
    PoolId poolId;

    uint256 tokenId;
    int24 tickLower;
    int24 tickUpper;

    function setUp() public {
        // creates the pool manager, utility routers, and test tokens
        deployFreshManagerAndRouters();
        deployMintAndApprove2Currencies();

        deployAndApprovePosm(manager);

        // Deploy the hook to an address with the correct flags
        address flags = address(
            uint160(
                Hooks.BEFORE_SWAP_FLAG
            ) ^ (0x4444 << 144) // Namespace the hook to avoid collisions
        );
        bytes memory constructorArgs = abi.encode(manager); //Add all the necessary constructor arguments from the hook
        deployCodeTo("ZKHook.sol:ZKMLHook", constructorArgs, flags);
        hook = ZKMLHook(flags);

        // Create the pool
        key = PoolKey(currency0, currency1, 3000, 60, IHooks(hook));
        poolId = key.toId();
        manager.initialize(key, SQRT_PRICE_1_1, ZERO_BYTES);

        // Provide full-range liquidity to the pool
        tickLower = TickMath.minUsableTick(key.tickSpacing);
        tickUpper = TickMath.maxUsableTick(key.tickSpacing);

        uint128 liquidityAmount = 100e18;

        (uint256 amount0Expected, uint256 amount1Expected) = LiquidityAmounts.getAmountsForLiquidity(
            SQRT_PRICE_1_1,
            TickMath.getSqrtPriceAtTick(tickLower),
            TickMath.getSqrtPriceAtTick(tickUpper),
            liquidityAmount
        );

        (tokenId,) = posm.mint(
            key,
            tickLower,
            tickUpper,
            liquidityAmount,
            amount0Expected + 1,
            amount1Expected + 1,
            address(this),
            block.timestamp,
            ZERO_BYTES
        );
    }

    function testZKMLHooks() public {

        bytes32[3] memory pubInputs = [
            bytes32(0x0000000000000000000000009ba65d244654610689e04446ac8f5565d13211cd),
            bytes32(0x06b85449b98f80da176647d679e0e28d047b00809670e36963065b769e9a4105),
            bytes32(0x1361e5fda385c7e0e9760f253fcc4db08a861764548c80d1a28e96d127d7d280)
        ];

        bytes memory proof = bytes("0x11304b9a1e29cbbf49f79c317bb90db6229f1fe3f45b5263bf977005962e23000b1d1bc8f73790234f7f869767d0d1c37ce20eb1f872f566f2029b69dcf4e61e12db5c4974c06c70d7471e61e367c65e99a51e24440dae8257d9117525d4c51a0bc7028f9a23c345fcabc2884b0012b6ba523e824353847e1ce81cd4816d11e022e1d22c4f276014a1fee9abd27463f4251a504f83b76d990a792891d659b2a0249d4e72667ec780888a27fce097c80ce3b1656d094178eb56f49f424bb5d4650097be9c38944bb7c869b57f3b47679c3ecb2a060928ab15e9f42c4aa1c87844286df03babe6274872317465c2c723d4f160e31a9cd4425bc27047a3fd766b4c2b8eaafbfd9ca75e4463fe2b7ac97dc03012d0b8adac1a513efe25c0b16924a92227d7b2d00c5bb40d7220cceb2cd3b06ddeccb373b14ff6278133b48467a6182739c51cda2921d5e0510cb55e3113faa707335c5abe020077cfc1e650908ddc1fe045e8e8136c7a1940b5b560985f0959c1b1723131b669f676d43b1bb98439279ac9782cbfa100a4750db2fb57b69a520922e585a408190d79697716d8ca461640e0342f452253caafd72e02f98716321e379e441687d12c23b10ef8b44c522b29a909ff818bc80fa3021057c7ad3524039f7e468ab9941027da31b3328a1e0766f3d4f39675320b6db3d85a9ad51082950371f4a596d594c87bda19e6a0cc19aad834a755c4bbb0fbfe8e4d6b1df1addc62b7d27f484004a9a334c54289501fd458dde9e04738fe21d8b1d1f550c7455c6d1d5c51939f2469d11387d0ebe717a76bc4e9d0a5dc9dd728148f800c2c2da20fd7e905f10b502778c41c3727f92006d386972eaf6e3ddb09489a12907b88adad0cd09b0f1c0a222a7ac30a9a51225ba6c7618aebaa6bae6865d3a682c9dcf6b0a29161b979ccc094ef92a871642db89a3315eb8b6b33d8fa0d55f33b9e40cd54d253ff6dafef6e90cb51845d3200fd77c5ce1561459c62d11e95c7f7b322c762506ca0d11ebd83b43b11c686ae18ac0c46d787c16b510714267ef081dbad76eacb11b50dd4a80cd358e624dff009a582e6b4e7bb8d73dbfcdcf160b944430478b436b12ead42d395be101019c928fc01243982cf03b0bd6c612cf30b1631acba81fcfe2e8f8a4d87f4371d445724771ceac0780f7259975a4f8222564f5b17cc87096163f1519a5a02caeb275d0b8950fa13c9d382f0fafd7422f0bcd2b79482dd5cb5a87a3efb1402c66cfb2e05ba3d7b32934bf810b5a4027574e525334699b0d1645f74ea1810b70bd535130ad1fdcb4374360be877709a2b8a05bcb00ac99d3ad5e57fd5e6042e2a54a2d711811cb578ccc080de9e70efe56849427bfc134d65baea06f212284aeca37ed02c7b6ad3e627baa8fba09d9a8f8828eb8fa7741fc2face1109a7bf1fbe84b64c2949feb69bf8d8f9a8a016368c5db19212e9968841056231474fecb55943d6660202d586d27ba8e36f322df2423106c2b548a1da9e49149b9a6376cd9647990f18dab91bca262026a141a1f710053a5b1d08fb27a72e4aa4306c6399de2521f9181bca911b0ab96df6aec5672b2fc4ff89c18e2d4b9cec813d5a5999a1c44b181613cb376b8c4c9155576f94a943dfc5cb4a6a06cfd80224057c63587a0bebb62ec9998c3b13c00368f2575f22794b227cac55b476f6b0eaaad4cec394f5f8b8005cf99e248bfcf3287a5c2e9603a7d7603f44621e258d0942af009ff81900c81218685f69e77025cae62c18d84a3acc0df954deec54688bfb27984702d34203043c0e46c892b9e844b7f009c8f5b14069b9b6099f28c74a25a2c48f8bc97ebd1047d9551b7e6418ed03c8abc48b3462f5385716f968c1ce7499a4e280c29f73142adfa9f4d296b187cb1d71272597099cef7c93d838373f71cdbe51312a99562ab55c13e61a33f77b024db27b4b70a6c8525bb063b3830e3029da9b7ecae144259a9457ee73e05b540d8699414b88c7d697d4e3b00625420aa2f6a1808cc9a7286422551644d56591eccee9279e06f6a6015a2f36f6f15338ff64f7d68cb14b0f0f6a0e93947479073872b9d877f130b20e04412d9b9d4f99905a1b9e3143fe1248ef887664049025032601165daf55c4c9a88cdfa9e2bc2e1c361280e7ac7a2846f20213bcd9a7710c0770cc6113a6ee1dd51cffd3686e3c82a60ebf6303f419e9fd5599589438d0b34e4bdea4fefab33ae7fd481670b5e240fe50c391ea812a97d9dfb2b555963877a737a1ff037ee83bcdafd98fece02bd94c96732b53c3258cf33ab9a6e99f453d0b3e617f40fae5531c75d886fe9b749fb7c81db03eb30d0f57324319a095e64171f9a7ce61e52dfd06cf9587b06140d950a1d62c24b81231561c77ea9eb7733881507599d8245c4dc06fcab9d5cb9de375fe78b5fdf31249d7303aa3efb59cdef5b1436cc2da6c6f4f92b52c4c6997189f2277b9ab6511b79ba9680215654e36343ec15c2ff4494a9142c83fc986652ad5b45f9756ad1785a5bc228fd5c2ea06047c9fb00b03b99104d401ca860a364dec52b37d17700ff13b27329e5739810659845beef479b1b6cc4234fa401b5380f1d8fbf26be31845e3276f77e3dd4e2657c118c2909ec90575c02d72f4edf6b534b0076217a50c85a984fe2018081632efdc074deae4ad372e753cb65433dcd0e774532e58cc2ceb25fab1eb191c1073a0a8c8a3f526ec5976670b809622b7cf832640874ec210337abbec9c2e4df609aacb73e977647e2c1c3b16bd4d0d52bd59fff8e60a031057ba0f38a1f43d8b441ee138d01e066b315fee523f80396ec8ace86adae8d8043b1db3b04c5fbce4295416c3f9d5eae9c550783f0785ff168badc48ad8121a2d12a7dc23a8ac6d4b88132a39232dc989de2c80f4c60f8a5af949d5f6b5d10a07fe4cf54b42a1cd8ae96464a4955915bc0aa17517200e31b3057d983cb264c81fa9ec4071581d8269edccecdcef9ed205580c5cd18c74878f0f8552652a01cc");

        // console.log(proof);
        // Perform a test swap //
        bool zeroForOne = true;
        int256 amountSpecified = -1e18; // negative number indicates exact input swap!
        BalanceDelta swapDelta = swap(key, zeroForOne, amountSpecified, abi.encode(pubInputs, proof));
        // ------------------- //

    }
}
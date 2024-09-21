// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {BaseHook} from "v4-periphery/src/base/hooks/BaseHook.sol";
import {IPoolManager} from "v4-periphery/lib/v4-core/src/interfaces/IPoolManager.sol";
import {Hooks} from "v4-periphery/lib/v4-core/src/libraries/Hooks.sol";
import {BeforeSwapDelta, BeforeSwapDeltaLibrary} from "v4-periphery/lib/v4-core/src/types/BeforeSwapDelta.sol";
import {PoolKey} from "v4-periphery/lib/v4-core/src/types/PoolKey.sol";
import {BaseUltraVerifier, UltraVerifier} from "./verifier.sol";
import "forge-std/console.sol";

contract ZKMLHook is BaseHook{

    UltraVerifier verifier;

    constructor(IPoolManager _poolManager) BaseHook(_poolManager) {
        verifier = new UltraVerifier();
    }

    function getHookPermissions() public pure override returns (Hooks.Permissions memory) {
        return Hooks.Permissions({
            beforeInitialize: false,
            afterInitialize: false,
            beforeAddLiquidity: false,
            afterAddLiquidity: false,
            beforeRemoveLiquidity: false,
            afterRemoveLiquidity: false,
            beforeSwap: true,
            afterSwap: false,
            beforeDonate: false,
            afterDonate: false,
            beforeSwapReturnDelta: false,
            afterSwapReturnDelta: false,
            afterAddLiquidityReturnDelta: false,
            afterRemoveLiquidityReturnDelta: false
        });
    }

    function beforeSwap(address, PoolKey calldata key, IPoolManager.SwapParams calldata, bytes calldata proofData)
        external
        override
        returns (bytes4, BeforeSwapDelta, uint24)
    {
        (bytes32[3] memory pubInputs, bytes memory proof) = abi.decode(proofData, (bytes32[3], bytes));
        bytes32[] memory dynamicArray = new bytes32[](pubInputs.length);
        for (uint256 i = 0; i < pubInputs.length; i++) {
            dynamicArray[i] = pubInputs[i];
        }
        // require(verifier.verify(proof, dynamicArray), "Invalid proof");
        return (BaseHook.beforeSwap.selector, BeforeSwapDeltaLibrary.ZERO_DELTA, 0);
    }
    
}
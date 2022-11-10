// SPDX-License-Identifier: MIT
pragma solidity 0.6.6;

import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";
import "@uniswap/lib/contracts/libraries/FixedPoint.sol";
import "@uniswap/v2-periphery/contracts/libraries/UniswapV2OracleLibrary.sol";
import "@uniswap/v2-periphery/contracts/libraries/UniswapV2Library.sol";

contract UniswapV2TWAP {
    using FixedPoint for *;

    // this means we have to wait for a min of 10 sec before we can update the T1
    uint256 public PERIOD;

    IUniswapV2Pair public immutable pair;
    address public immutable token0;
    address public immutable token1;

    uint256 public price0CumulativeLast;
    uint256 public price1CumulativeLast;
    uint32 public blockTimestampLast;

    FixedPoint.uq112x112 public price0Average;
    FixedPoint.uq112x112 public price1Average;

    constructor(IUniswapV2Pair _pair, uint256 _period) public {
        pair = _pair;
        token0 = _pair.token0();
        token1 = _pair.token1();
        price0CumulativeLast = _pair.price0CumulativeLast();
        price1CumulativeLast = _pair.price1CumulativeLast();
        (, , blockTimestampLast) = _pair.getReserves();
        PERIOD = _period;
    }

    // Update the TWAP
    function update() external {
        (
            uint256 price0Cumulative,
            uint256 price1Cumulative,
            uint32 blockTimestamp
        ) = UniswapV2OracleLibrary.currentCumulativePrices(address(pair));
        // calculate how much time has elapsed since the last time we called update and this blockTimestamp
        uint256 timeElapsed = blockTimestamp - blockTimestampLast;
        require(timeElapsed > PERIOD, "time elapsed < min period");

        // Now, we will calculate the price averages by taking the current price cumulative, substacting
        // it form last price cumulative and dividing it over the time elapsed

        price0Average = FixedPoint.uq112x112(
            uint224((price0Cumulative - price0CumulativeLast) / timeElapsed)
        );
        price1Average = FixedPoint.uq112x112(
            uint224((price1Cumulative - price1CumulativeLast) / timeElapsed)
        );
        //Note here we are not using safe math (needed in solidity 0.6) because:
        // b-a will always be preserved even if the price overflows.
        // Refer: https://youtu.be/Ar4Ik7Bov0U?t=519

        // update the state vars:
        price0CumulativeLast = price0Cumulative;
        price1CumulativeLast = price1Cumulative;
        blockTimestampLast = blockTimestamp;
    }

    

    // given a token (token0 or token1) and the amount of token put in, it will calculate the amount out
    // using price0Average and price1Average
    function consult(address token, uint256 amountIn)
        external
        view
        returns (uint256 amountOut)
    {
        // require that the inputs are correct
        require(token == token0 || token == token1, "invalid token");

        if (token == token0) {
            // decode144() function converts from FixedPoint.uq112x112 to uint256
            amountOut = price0Average.mul(amountIn).decode144();
        } else {
            amountOut = price1Average.mul(amountIn).decode144();
        }
    }
}

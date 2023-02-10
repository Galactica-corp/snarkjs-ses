/*
    Copyright 2018 0KIMS association.

    This file is part of snarkJS.

    snarkJS is a free software: you can redistribute it and/or modify it
    under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    snarkJS is distributed in the hope that it will be useful, but WITHOUT
    ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
    or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public
    License for more details.

    You should have received a copy of the GNU General Public License
    along with snarkJS. If not, see <https://www.gnu.org/licenses/>.
*/

import groth16_prove from "./groth16_prove.js";
import wtns_calculate from "./wtns_calculate.js";
import { wtnsCalculateMemory } from "./wtns_calculate.js";
import { groth16ProveMemory } from "./groth16_prove.js";

export default async function groth16FullProve(input, wasmFile, zkeyFileName, logger) {
    const wtns= {
        type: "mem"
    };
    await wtns_calculate(input, wasmFile, wtns);
    return await groth16_prove(zkeyFileName, wtns, logger);
}

/**
 * Patched alternative to groth16FullProve that does not use the file system. (works better in SES)
 * @param {*} wasm wasm file as Uint8Array
 * @param {*} zkeyHeader zkeyHeader
 * @param {*} zkeySections zkeyCoeffsBuffer
 * @param {*} options 
 * @returns witness as Uint8Array
 */
export async function groth16FullProveMemory(input, wasm, zkeyHeader, zkeySections, logger) {
    const wtns= {
        type: "mem"
    };
    // let wtns = await wtnsCalculateMemory(input, wasm, wtns);
    await wtns_calculate(input, wasm, wtns);
    return await groth16ProveMemory(zkeyHeader, zkeySections, wtns, logger);
}

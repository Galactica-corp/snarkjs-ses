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

import * as fastFile from "fastfile";
import { WitnessCalculatorBuilder } from "circom_runtime";
import * as wtnsUtils from "./wtns_utils.js";
import * as binFileUtils from "@iden3/binfileutils";

export default async function wtnsCalculate(input, wasmFileName, wtnsFileName, options) {

    const fdWasm = await fastFile.readExisting(wasmFileName);
    const wasm = await fdWasm.read(fdWasm.totalSize);
    await fdWasm.close();

    const wc = await WitnessCalculatorBuilder(wasm);
    if (wc.circom_version() == 1) {
        const w = await wc.calculateBinWitness(input);

        const fdWtns = await binFileUtils.createBinFile(wtnsFileName, "wtns", 2, 2);

        await wtnsUtils.writeBin(fdWtns, w, wc.prime);
        await fdWtns.close();
    } else {
        const fdWtns = await fastFile.createOverride(wtnsFileName);

        const w = await wc.calculateWTNSBin(input);

        await fdWtns.write(w);
        await fdWtns.close();
    }
}

/**
 * Patched alternative to wtnsCalculate that does not use the file system. (works better in SES)
 * @param {*} wasm file as Uint8Array
 * @param {*} options 
 * @returns witness as Uint8Array
 */
export async function wtnsCalculateMemory(input, wasm, options) {
    const wc = await WitnessCalculatorBuilder(wasm);
    // maybe not needed for witness because it is written to mem file
    // if (wc.circom_version() == 1) {
    //     return await wc.calculateBinWitness(input);
    // } else {
    //     return await wc.calculateWTNSBin(input);
    // }
    if (wc.circom_version() == 1) {
        const w = await wc.calculateBinWitness(input);

        const fdWtns = await binFileUtils.createBinFile(wtnsFileName, "wtns", 2, 2);

        await wtnsUtils.writeBin(fdWtns, w, wc.prime);
        await fdWtns.close();
    } else {
        const fdWtns = await fastFile.createOverride(wtnsFileName);

        const w = await wc.calculateWTNSBin(input);

        await fdWtns.write(w);
        await fdWtns.close();
    }
}

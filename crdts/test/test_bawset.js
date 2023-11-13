import { BAWSet } from "../bawset.js";
import { test_addWins, test_bottom, test_concurrency, test_element_readdable, test_merge } from "./test_general_awset.js";

function awset(tag) {
    return new BAWSet();
}
export const test_addWins_bawset = () => { test_addWins(awset) };

export const test_bottom_bawset = () => test_bottom(awset);
export const test_concurrency_bawset = () => test_concurrency(awset);
export const test_element_readdable_bawset = () => test_element_readdable(awset);
export const test_merge_bawset = () => test_merge(awset);
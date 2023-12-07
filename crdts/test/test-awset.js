import { AWSet } from "../awset.js";
import { test_addWins, test_bottom, test_concurrency, test_element_readdable, test_merge } from "./test_general_awset.js";

function awset(tag) {
    return new AWSet(tag);
}
export const test_addWins_awset = () => test_addWins(awset);
export const test_bottom_awset = () => test_bottom(awset);
export const test_element_readdable_awset = () => test_element_readdable(awset);
export const test_merge_awset = () => test_merge(awset);

export const test_concurrency_awset = () => test_concurrency(awset);
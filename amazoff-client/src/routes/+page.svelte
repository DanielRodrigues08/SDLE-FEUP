<script>
    import { openedLists, storageSettings } from "./stores";
    import { onMount } from "svelte";
    // This dependency is needed because, we can't find a solution to store dir handle to the
    // local storage sadly
    import { get, set } from "idb-keyval";
    async function getDirFromStorage() {
        const maybeHandle = await get("dir");
        return maybeHandle;
    }
    async function storeDirToStorage(dirHandle) {
        await set("dir", dirHandle);
    }

    async function storeFsSettings(dirHandle, access = true) {
        storageSettings.update((s) => {
            const newS = { ...s };
            newS.fs.access = access;
            newS.fs.dir = dirHandle;
            return newS;
        });
        storeDirToStorage(dirHandle);
    }

    async function grantFsAccess() {
        // Destructure the one-element array.
        const dirHandle = await window.showDirectoryPicker();
        storeFsSettings(dirHandle);
    }

    function removeFsAccess() {
        storageSettings.update((s) => {
            const newS = { ...s };
            newS.fs.access = false;
            newS.fs.dir = null;
            return newS;
        });
    }
    function changeFsDirectory() {
        return grantFsAccess();
    }
    async function verifyPermission(handle, readWrite = true) {
        const options = {};
        if (readWrite) {
            options.mode = "readwrite";
        }
        // Check if permission was already granted. If so, return true.
        if ((await handle.queryPermission(options)) === "granted") {
            return true;
        }
        return false;
    }
    onMount(async () => {
        const maybeHandle = await getDirFromStorage();
        if (!maybeHandle) {
            return;
        }
        const hasPermission = await verifyPermission(maybeHandle);
        storeFsSettings(maybeHandle, hasPermission);
    });
</script>

<h1>Amazoff</h1>

<section>
    <h2>Storage Settings</h2>
    {#if $storageSettings.fs.dir}
        {#if !$storageSettings.fs.access}
            <p>
                Amazoff Needs To Regain Acess to {$storageSettings.fs.dir.name}
            </p>
            <button
                on:click={async () => {
                    const res =
                        await $storageSettings.fs.dir.requestPermission();
                    console.log(res);
                    if (res === "granted") {
                        storeFsSettings($storageSettings.fs.dir);
                    }
                }}>Allow Access</button
            >
        {:else}
            <p>Amazoff Has Access To The File System</p>
            <p>Storing files in {$storageSettings.fs.dir.name}</p>
            <button on:click={removeFsAccess}>Remove FileSytem Acess</button>
        {/if}
        <button on:click={changeFsDirectory}>Change Directory</button>
    {:else}
        <p>Amazoff does not have Access To The File System</p>
        <button on:click={grantFsAccess}>Grant Access</button>
    {/if}
</section>

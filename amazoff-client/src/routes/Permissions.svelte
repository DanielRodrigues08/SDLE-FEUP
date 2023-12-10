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
        if (window.showDirectoryPicker) {
            const dirHandle = await window.showDirectoryPicker();
            storeFsSettings(dirHandle);
        } else {
            console.log("[WARNING] THIS BROWSER DOES NOT SUPPORT FILE SYSTEM");
        }
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

    let statusText = "";
    let statusButton = "";

    $: {
        if ($storageSettings.fs.dir) {
            if ($storageSettings.fs.access) {
                statusText = "";
                statusButton = "btn-success";
            } else {
                statusText = "Needs to regain access to the FS";
                statusButton = "btn-warning";
            }
        } else {
            statusText = "No FS access";
            statusButton = "btn-danger";
        }
    }
</script>

<div class="mx-2">
    {statusText}
</div>
<button
    type="button"
    class="btn {statusButton}"
    data-bs-toggle="modal"
    data-bs-target="#fileSystemAccess"
>
    File System
</button>

<div
    class="modal fade"
    id="fileSystemAccess"
    tabindex="-1"
    aria-labelledby="fileSystemAccess"
    aria-hidden="true"
>
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="fileSystemAccessTitle">
                    File System Access
                </h1>
                <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                ></button>
            </div>
            <div class="modal-body">
                {#if $storageSettings.fs.dir}
                    {#if !$storageSettings.fs.access}
                        <p>
                            Amazoff needs to regain access to: {$storageSettings
                                .fs.dir.name}
                        </p>
                    {:else}
                        <p>Amazoff has access to the file system</p>
                        <p>Storing files in: {$storageSettings.fs.dir.name}</p>
                    {/if}
                {:else}
                    <p>Amazoff does not have Access To The File System</p>
                {/if}
            </div>
            <div class="modal-footer">
                {#if $storageSettings.fs.dir}
                    {#if !$storageSettings.fs.access}
                        <button
                            class="btn btn-primary"
                            on:click={async () => {
                                const res =
                                    await $storageSettings.fs.dir.requestPermission(
                                        {
                                            mode: "readwrite",
                                        },
                                    );
                                console.log(res);
                                if (res === "granted") {
                                    storeFsSettings($storageSettings.fs.dir);
                                }
                            }}
                            >Allow Access
                        </button>
                    {:else}
                        <button
                            class="btn btn-primary"
                            on:click={removeFsAccess}
                            >Remove Access
                        </button>
                    {/if}
                    <button class="btn btn-primary" on:click={changeFsDirectory}
                        >Change Directory
                    </button>
                {:else}
                    <button class="btn btn-primary" on:click={grantFsAccess}
                        >Grant Access
                    </button>
                {/if}

                <button
                    type="button"
                    class="btn btn-secondary"
                    data-bs-dismiss="modal"
                    >Close
                </button>
            </div>
        </div>
    </div>
</div>

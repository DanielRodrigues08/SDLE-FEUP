<script>
  import { userSettings } from "./stores";

  let statusText = "";
  let statusButton = "";
  let serverUrl = "";

    function disconnect(){
        userSettings.disconnect();
    }

    function connect(){
        if(serverUrl === ""){
            return;
        }
        userSettings.connect(serverUrl);

    }

  $: {
    if ($userSettings.server) {
      statusButton = "btn-success";
      statusText = ""
    } else {
      statusButton = "btn-danger";
      statusText = "Disconnected from server";
    }
  }
</script>

<!-- Button trigger modal -->

{#if statusText !== ""}
  <div class="mx-2">
    {statusText}
  </div>
{/if}

<button
  type="button"
  class="btn {statusButton} mx-2"
  data-bs-toggle="modal"
  data-bs-target="#syncSettingsModal"
>
  Sync Settings
</button>

<!-- Modal -->
<div class="modal fade" id="syncSettingsModal" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel">Sync Settings</h1>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
        ></button>
      </div>
      <div class="modal-body">
        {#if $userSettings.server}
          <p>Connected to: {$userSettings.server}</p>
        {:else}
          <p>Not connected to a server.</p>
            <div class="input-group mb-3">
                <span class="input-group-text" id="basic-addon1">Server URL</span>
                <input
                type="text"
                class="form-control"
                placeholder="http://localhost:3000"
                aria-label="Server URL"
                aria-describedby="basic-addon1"
                bind:value={serverUrl}
                />
            </div>
        {/if}
      </div>
      <div class="modal-footer">
        {#if $userSettings.server}
          <button
            type="button"
            class="btn btn-danger"
            on:click={disconnect}
          >
            Disconnect
          </button>
        {:else}
          <button
            type="button"
            class="btn btn-success"
            on:click={connect}
          >
            Connect
          </button>
        {/if}
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"
          >Close</button
        >
      </div>
    </div>
  </div>
</div>

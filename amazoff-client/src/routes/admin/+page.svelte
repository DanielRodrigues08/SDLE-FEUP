<script>
  import { userSettings } from "../stores";
  import axios from "axios";

  let addNodeForm = {
    host: null,
    port: null,
    instances: null,
    degree: null,
  };

  let response = "";

  async function addNode() {
    if (
      !(
        addNodeForm.host ||
        addNodeForm.port ||
        addNodeForm.instances ||
        addNodeForm.degree
      )
    ) {
      response = "Please fill all the fields";
    } else {
      try {
        const res = await axios.post(
          $userSettings.server + "/addNode",
          addNodeForm
        );
        response = res.data.message;
        addNodeForm.host = null;
        addNodeForm.port = null;
        addNodeForm.instances = null;
        addNodeForm.degree = null;
      } catch (err) {
        console.log(err);
        response = "Error adding node";
      } finally {
        setTimeout(() => {
          response = "";
        }, 10000);
      }
    }
  }
</script>

<h1 class="text-center mt-3">Admin Page</h1>

<div class="accordion accordion m-5" id="accordionAdminActions">
  <div class="accordion-item">
    <h2 class="accordion-header">
      <button
        class="accordion-button collapsed"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#flush-collapseOne"
        aria-expanded="false"
        aria-controls="flush-collapseOne"
      >
        Add Node to the Ring
      </button>
    </h2>
    <div
      id="flush-collapseOne"
      class="accordion-collapse collapse"
      data-bs-parent="#accordionAdminActions"
    >
      <div class="accordion-body">
        {#if $userSettings.server}
          <form class="my-2">
            <div class="input-group input-group mb-1">
              <span class="input-group-text">Host</span>
              <input
                type="text"
                class="form-control"
                bind:value={addNodeForm.host}
              />
            </div>
            <div class="input-group input-group mb-1">
              <span class="input-group-text">Port</span>
              <input
                type="number"
                class="form-control"
                min="1"
                bind:value={addNodeForm.port}
              />
            </div>
            <div class="input-group input-group mb-1">
              <span class="input-group-text">Instances</span>
              <input
                type="number"
                class="form-control"
                min="1"
                bind:value={addNodeForm.instances}
              />
            </div>
            <div class="input-group input-group mb-3">
              <span class="input-group-text">Degree Gossip</span>
              <input
                type="number"
                class="form-control"
                min="1"
                bind:value={addNodeForm.degree}
              />
            </div>
          </form>
          <div>
            <button type="submit" class="btn btn-primary" on:click={addNode}
              >Add Node</button
            >
            <p class="fw-semi-bold float-end">{response}</p>
          </div>
        {:else}
          <p class="fw-semi-bold m-3">
            Please connect to a server before adding a Node!
          </p>
        {/if}
      </div>
    </div>
  </div>
  <div class="accordion-item">
    <h2 class="accordion-header">
      <button
        class="accordion-button collapsed"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#flush-collapseTwo"
        aria-expanded="false"
        aria-controls="flush-collapseTwo"
      >
        Remove Node from the Ring
      </button>
    </h2>
    <div
      id="flush-collapseTwo"
      class="accordion-collapse collapse"
      data-bs-parent="#accordionAdminActions"
    >
      <div class="accordion-body">
        <div class="accordion-body">
          {#if $userSettings.server}
            <form class="my-2">
              <div class="input-group input-group mb-1">
                <span class="input-group-text">Host</span>
                <input
                  type="text"
                  class="form-control"
                  bind:value={addNodeForm.host}
                />
              </div>
              <div class="input-group input-group mb-1">
                <span class="input-group-text">Port</span>
                <input
                  type="number"
                  class="form-control"
                  min="1"
                  bind:value={addNodeForm.port}
                />
              </div>
              <div class="input-group input-group mb-1">
                <span class="input-group-text">Instances</span>
                <input
                  type="number"
                  class="form-control"
                  min="1"
                  bind:value={addNodeForm.instances}
                />
              </div>
              <div class="input-group input-group mb-3">
                <span class="input-group-text">Degree Gossip</span>
                <input
                  type="number"
                  class="form-control"
                  min="1"
                  bind:value={addNodeForm.degree}
                />
              </div>
            </form>
            <div>
              <button type="submit" class="btn btn-primary" on:click={addNode}
                >Add Node</button
              >
              <p class="fw-semi-bold float-end">{response}</p>
            </div>
          {:else}
            <p class="fw-semi-bold m-3">
              Please connect to a server before adding a Node!
            </p>
          {/if}
        </div>
      </div>
    </div>
  </div>
</div>

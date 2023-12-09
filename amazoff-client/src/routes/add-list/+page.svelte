<script>
  import { openedLists } from "../stores";
  import { goto } from "$app/navigation";
  let name = "";

  function handleEnter(e) {
    if (e.key === "Enter") {
      // copy list link to the clip board
      // redirect to new list
      const newList = {
        id: Math.floor(Math.random() * 20),
        name: name,
      };
      openedLists.add(newList);
      openedLists.setCurrent(newList.id);
      goto(`/list/${newList.id}`);
      name = "";
    }
  }

  $: openedLists.setCurrent(null);
</script>

<div class="container">
  <div class="row justify-content-center">
    <div class="col-6">
      <h1 class="text-center mt-3">Add List</h1>
      <form>
        <label for="inputName" class="form-label">Name</label>
        <input
          type="text"
          class="form-control"
          id="inputName"
          aria-describedby="inputNameHelp"
        />
        <div id="inputNameHelp" class="form-text">
          Enter the name of the list you want to create. Only you will be able
          to see this name.
        </div>

        <label for="inputID" class="form-label">ID</label>
        <input type="text" class="form-control" id="inputID" />
        <div id="inputID" class="form-text">
          Provide the list's identifying number to create it. This ID will be
          used to share the list with others.
        </div>
        <div
          class="p-3 text-primary-emphasis bg-primary-subtle border border-primary-subtle rounded-3 my-2"
        >
          If you provide an ID that exists in the cloud, you will modify the
          corresponding list.
        </div>
        <button type="submit" class="btn btn-primary float-end">Add</button>
      </form>
    </div>
  </div>
</div>


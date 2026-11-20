//const information = document.getElementById('info')
//information.innerText = `This app is using Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), and Electron (v${versions.electron()})`
//var nodeConsole = require('console');
//var myConsole = new nodeConsole.Console(process.stdout, process.stderr);
//myConsole.log('Hello World!');

/*
const func = async () => {
  const response = await window.versions.ping()
  console.log(response) // prints out 'pong'
  const pingy = document.getElementById('ping')
  pingy.innerText = response
}

func()

document.getElementById('createDirButton').addEventListener('click', () => {
    console.log("Button clicked");
    const dirName = document.getElementById('dirNameInput').value;
    if (dirName) {
        window.electronAPI.createDirectory(dirName);
    } else {
        document.getElementById('statusMessage').textContent = 'Please enter a directory name.';
    }
});

// Handle the response from the main process

window.electronAPI.handleDirectoryCreated((status, message) => {
    console.log("Inside");
    const statusElement = document.getElementById('statusMessage');
    if (status === 'success') {
        statusElement.textContent = 'Directory successfully created!';
    } else if (status === 'exists') {
        statusElement.textContent = 'Directory already exists.';
    } else if (status === 'error') {
        statusElement.textContent = `Error creating directory: ${message}`;
    }
});
*/

/*
document.getElementById('createDirButton').addEventListener('click', async () => {
  console.log("Button clicked");
  const dirName = document.getElementById('dirNameInput').value;
  const statusEl = document.getElementById('statusMessage');

  if (!dirName) {
    statusEl.textContent = 'Please enter a directory name.';
    return;
  }

  try {
    const res = await window.electronAPI.createDirectory(dirName);
    if (res?.ok) {
      statusEl.textContent = `Directory created: ${res.path}`;
    } else {
      statusEl.textContent = `Error: ${res?.error || 'Unknown error'}`;
    }
  } catch (e) {
    statusEl.textContent = `Error: ${e?.message || e}`;
  }
});
*/


console.log("DevExpress =", typeof DevExpress);


document.getElementById('form-container').addEventListener('submit', async (event) => {

    event.preventDefault(); // Prevent default form submission
    let form = $('#form').dxForm("instance");

    if (!form) {
      console.error("dxForm instance not found");
      return;
    }

    form.updateData();
    const formData = form.option("formData");
    
    console.log("formData:", JSON.stringify(formData, null, 2));
    
    // If you need to manipulate or view the data:
    // const projectName = formData.projectName;
    // const documentName = formData.documentName;
    // const isTXO = formData.TXO;
    // const Instructions = formData.instructions;
    // console.log("isTXO: ",isTXO);
    // console.log("documentName: ",documentName);
    const {
      projectName,
      documentName,
      TXO: isTXO,
      instructions
    } = formData;

    console.log("isTXO:", isTXO);
    console.log("documentName: ", documentName);

    try {

      const res = await window.electronAPI.createDirectory(formData);
      form.clear();

      if (res?.ok) {
        //statusEl.textContent = `Directory created: ${res.path}`;
        alert(`Directory created: ${res.path}`);
      } else {
        //statusEl.textContent = `Error: ${res?.error || 'Unknown error'}`;
        alert(`Error: ${res?.error || 'Unknown error'}`);
      }
      
    } catch (e) {
      //statusEl.textContent = `Error: ${e?.message || e}`;
      alert(`Error: ${e?.message || e}`);
    }

});

// removed Testing
// document.getElementById('openWebpageModal').addEventListener('click', () => {
//     console.log("Button clicked");
//     window.electronAPI.openModal('https://3dspace-web36.plm.lci1.com:447/3dspace');
//     session.defaultSession.cookies.get({ url: 'https://3dspace-web36.plm.lci1.com:447/3dspace' })
//       .then((cookies) => {
//         console.log(cookies)
//       }).catch((error) => {
//       console.log(error)
//     })

// });
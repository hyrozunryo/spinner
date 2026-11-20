const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron/main');
const path = require('node:path');
const fs = require('fs');

require('update-electron-app');

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 650,
    webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        contextIsolation: true,
        nodeIntegration: false,
        sandbox: false,
    }
  })

  win.loadFile(path.join(__dirname, 'index.html'));
}

function createModalWindow(url) {
    const modalWindow = new BrowserWindow({
        parent: createWindow, // Set the parent window
        modal: true,        // Make it modal
        show: false,        // Hide until content is ready
        width: 400,
        height: 300,
    });

    modalWindow.loadURL(url); // Load the specified webpage URL

    modalWindow.once('ready-to-show', () => {
        modalWindow.show(); // Show the window when the content is ready
    });
}

function updateTemplate() {

  // 1. Load the template file
  const template = fs.readFileSync('app\\template.html', 'utf8');

  // 2. Define your data and conditional logic
  const data = {
      userName: "John Doe",
      status: "premium",
      balance: 150.50
  };

  // 3. Helper function for conditional styling
  const getStatusStyle = (status) => {
      return status === 'premium' ? 'color: gold; font-weight: bold;' : 'color: gray;';
  };

  // 4. Regex to find tags {{ ... }} and replace them
  const rendered = template.replace(/\{\{(.*?)\}\}/g, (match, expression) => {
      try {
          // Create a Function that returns the result of the expression
          const evaluator = new Function('data', 'getStatusStyle', `with (data) { return ${expression}; }`);
          return evaluator(data, getStatusStyle) || '';
      } catch (err) {
          console.error(`Error evaluating expression: ${expression}`, err.message);
          return '';
      }
  });

  console.log(rendered);
}

app.whenReady().then(() => {
  ipcMain.handle('ping', () => 'pong')
  
  // Promise-style directory creation
  ipcMain.handle('create-directory', async (_event, json) => {

    try {
      updateTemplate();

      console.log("Json: ",json);
      let packagePath = "";
      const projectName = json.projectName;
      const projectTitle = json.projectTitle;
      const documentName = json.documentName;
      const isTXO = json.TXO;
      const Instructions = JSON.parse(json.instructions);
      const jspSelection = json.jspSelection;
      const jarSelection = json.jarSelection;
      const jspSelectionBox = json.jspSelectionBox;

      const basePath = projectTitle ? `${projectName} - ${projectTitle}\\${documentName}` : `${projectName}\\${documentName}`;
      const dirName = `${basePath}\\Spinner\\Business`;
      const instructionsDir = `${basePath}\\`;
      const spaceDirectory = `${basePath}\\3DSpace\\`;
      
      if (typeof dirName !== 'string' || !dirName.trim()) {
        throw new Error('Invalid directory name');
      }

      // Create under user's Documents for your use case
      //const base = app.getPath('documents'); //this line gets specific path's in windows
      const base = 'C:\\Projects26';
      const fullPath = path.join(base, dirName);

      // Prevent path traversal outside Documents
      const normalizedBase = path.resolve(base);
      const normalizedTarget = path.resolve(fullPath);
      if (normalizedTarget !== normalizedBase && !normalizedTarget.startsWith(normalizedBase + path.sep)) {
        throw new Error('Path must be inside Documents');
      }

      fs.mkdirSync(fullPath, { recursive: true });

      if (Array.isArray(jarSelection) && jarSelection.length > 0) {
        const lib = spaceDirectory + "lib";
        const jarPath = path.join(base, lib);
        fs.mkdirSync(jarPath, { recursive: true });
      }

      if (jspSelection) {
        for (i=0; i<jspSelectionBox.length; i++) {
          console.log("Directories: ",jspSelectionBox[i]);
          const appDirectory = spaceDirectory + jspSelectionBox[i];
          const totalPath = path.join(base, appDirectory);
          fs.mkdirSync(totalPath, {recursive: true});
        }
      }

      if (Instructions) {

        packagePath = path.join(base, instructionsDir);

        const nl = '\r\n';
        const lines = [];

        lines.push(``);
        lines.push(`1. Spin:`);
        lines.push(``);
        lines.push(`set context user creator filename E:\\DassaultSystemes\\R2025x\\3DSpace\\credentials\\creator;`);
        lines.push(`tcl;`);
        lines.push(`cd {C:\\temp\\Spin\\${documentName}\\Spinner}`);
        lines.push(`exit`);
        lines.push(`execute program emxSpinnerAgent.tcl force update;`);

        // ✅ Conditional content
        if (jarSelection.length !== 0 && jarSelection.includes(1)) {
          console.log("Enovia Library selected");
          lines.push(``);
          lines.push(``);
          lines.push(`-- Deploy LCIEnoviaLibrary.jar`);
          lines.push(``);
          lines.push(`For Development:`);
          lines.push(`Copy attached jar file and paste it in:`);
          lines.push(`E:\\3DExperience\\TomEE3DSpace\\webapps\\3dspace\\WEB-INF\\lib`);
          lines.push(``);
          lines.push(`For Production:`);
          lines.push(`Download jar from DOC-0073630 <REVISION> and paste it in:`);
          lines.push(`E:\\3DExperience\\TomEE3DSpace\\webapps\\3dspace\\WEB-INF\\lib`);
        }

        if (jarSelection.includes(2)) {
          console.log("D365 Integration selected");
          lines.push(``);
          lines.push(``);
          lines.push(`-- Deploy lcienoviad365integration.jar`);
          lines.push(``);
          lines.push(`For Development:`);
          lines.push(`Copy attached jar file and paste it in:`);
          lines.push(`E:\\3DExperience\\TomEE3DSpace\\webapps\\3dspace\\WEB-INF\\lib`);
          lines.push(``);
          lines.push(`For Production:`);
          lines.push(`Download jar from DOC-0240023 <REVISION> and paste it in:`);
          lines.push(`E:\\3DExperience\\TomEE3DSpace\\webapps\\3dspace\\WEB-INF\\lib`);
        }

        if (jarSelection.includes(3)) {
          console.log("Enovia Web Services selected");
          lines.push(``);
          lines.push(``);
          lines.push(`-- Deploy lcienoviawebservices.jar`);
          lines.push(``);
          lines.push(`For Development:`);
          lines.push(`Copy attached jar file and paste it in:`);
          lines.push(`E:\\3DExperience\\TomEE3DSpace\\webapps\\3dspace\\WEB-INF\\lib`);
          lines.push(``);
          lines.push(`For Production:`);
          lines.push(`Download jar from DOC-0379073 <REVISION> and paste it in:`);
          lines.push(`E:\\3DExperience\\TomEE3DSpace\\webapps\\3dspace\\WEB-INF\\lib`);
        }

        if (isTXO) {
          lines.push(``);
          lines.push(``);
          lines.push(`-- TXO Section:`);
          lines.push(`  a. Login as PLMADM`);
          lines.push(`	b. Load up application Data Model Customization`);
          lines.push(`	c. Select the icon for 'Import Package(s)' on the toolbar`);
          lines.push(`	d. Browse from the slide-in select PackagesExport.zip from inside the spinner document.`);
          lines.push(`	e. This import may take awhile due to indexing Objects.`);
        }

        const content = lines.join('\r\n') + '\r\n';

        fs.writeFileSync(`${packagePath}Instructions.txt`, content, 'utf8');
      }

      // await dialog.showOpenDialog({
      //   defaultPath: path.join(base, projectName),
      //   properties: ['openDirectory']
      // });

      //Open new directory in new Exporer window.
      shell.openPath(path.join(base, basePath));

      return { ok: true, path: fullPath };

    } catch (err) {
      console.error('[create-directory] error:', err);
      return { ok: false, error: err.message || String(err) };
    }
  });

  ipcMain.on('open-webpage-modal', (event, url) => {
    createModalWindow(url);
  });
  
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
  });
})


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

//Cross Communication
// Handle the IPC message to create a directory
/*
ipcMain.on('create-directory', (event, dirName) => {
  const dirPath = path.join(app.getPath('documents'), dirName); // Example path in user's documents
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true }); // Create directory recursively if needed
      console.log(`Directory created at: ${dirPath}`);
      // Optionally, send a success message back to the renderer
      event.reply('directory-created', 'success'); 
    } else {
        console.log(`Directory already exists: ${dirPath}`);
        event.reply('directory-created', 'exists');
    }
  } catch (err) {
    console.error(`Failed to create directory: ${err}`);
    event.reply('directory-created', 'error', err.message);
  }
});
*/
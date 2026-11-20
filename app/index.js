//const jarData = require('store/jarData.js');

$(() => {

  let audioCtx;
  let typewriterBuffer;

  // 1. Initialize Audio Context and Load Buffer
  async function initAudio() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext) ();
  
    // Fetch and decode the sound file once
    const response = await fetch('audio/mixkit-hard-typewriter-click-1119_short.wav');
    const arrayBuffer = await response.arrayBuffer();
    typewriterBuffer = await audioCtx.decodeAudioData(arrayBuffer);
  }

  // 2. Play function (Low Latency)
  function playClick() {
   if (!typewriterBuffer) return;

    // Create a temporary source node for THIS specific click
    const source = audioCtx.createBufferSource();
    source.buffer = typewriterBuffer;
    source.connect(audioCtx.destination);
    source.start(0); // Plays instantly
  }

  // 3. Typewriter Logic
  const text = "Low latency typewriter effect active.";
  let i = 0;

  function type() {
    if (i < text.length) {
      playClick();
      document.getElementById('output').innerHTML += text.charAt(i);
      i++;
      setTimeout(type, 100);
    }
  }


  // Define the text to be typed
  const textToType = 'Hello, would you like to play a game?';
  // Get the HTML element by its ID
  const targetElement = document.getElementById('typewriter-text');
  const soundElement = document.getElementById('typing-sound');
  // Set the typing speed in milliseconds
  const typingSpeed = 100; 
  let index = 0; // Initialize an index to track the current character

function typeWriter() {
  if (index < textToType.length) {
    // Append the character at the current index to the element's content
    //const keystrokeSound = new Audio(soundElement.src);
    //keystrokeSound.play();
    playClick();

    targetElement.textContent += textToType.charAt(index);

    index++;
    // Call the function again after a delay
    setTimeout(typeWriter, typingSpeed);
  }
}

  // 1. Initialize the LoadPanel
  /*  $("#loadPanel").dxLoadPanel({
        message: "Loading...",
        showPane: true,
        visible: false, // Initially hidden
        position: { my: 'center', at: 'center', of: window }
    }); */
  initAudio();

  const loadPanelInstance = $("#loadPanel"); //.dxLoadPanel("instance");
  // 2. Show the LoadPanel
  loadPanelInstance.show();
  // Start the typewriter effect when the script loads
  const timerValue = 3000;
  setTimeout(typeWriter, timerValue);

  // 3. Simulate loading (e.g., data fetching)
  setTimeout(function() {
    // 4. Hide the LoadPanel
    loadPanelInstance.hide();
    // 5. Show the main content
    $("#mainContent").show();
  }, 10000); // 5 seconds delay

  const jarFiles = new DevExpress.data.DataSource({
    store: jarData,
    key: 'id',
    //group: 'Category',
    requireTotalCount: true
  });

  console.log("something: ",jarFiles.totalCount());
  console.log("Other Thing: ",jarData[1].Name);

  var formInstance = $('#form').dxForm({
    labelMode: 'floating',
    formData: {
      projectName: "",
      projectTitle: "",
      documentName: "",
      instructions: false,
      TXO: false,
      jarSelection: [],
      jspSelection: false,
      jspSelectionBox: []
    },
    readOnly: false,
    showColonAfterLabel: true,
    labelLocation: 'left',
    minColWidth: 1000,
    colCount: 'auto',
    items: [{
        itemType: "group",
        caption: "Package Information",
        colCount: 2,
        items: [{
            dataField: "projectName",
            isRequired: "true"
        }, {
            dataField: "projectTitle"
        }, {
            dataField: "documentName",
            isRequired: "true"
        }, {
            dataField: "jarSelection",
            editorType: "dxTagBox",
            editorOptions: {
              dataSource: jarData,
              valueExpr: 'id',
              displayExpr: 'Name',
              groupExpr: 'Category',
              searchEnabled: true,
              showSelectionControls: true,
              applyValueMode: 'useButtons'
            } 
        }, {
            dataField: "instructions",
            editorType: 'dxCheckBox'
        }, {
            dataField: "TXO",
            editorType: 'dxCheckBox'
        }, {
            dataField: "jspSelection",
            editorType: 'dxCheckBox',
            label: {
                text: "Enable JSP Selection"
            },
        }, {
          dataField: "jspSelectionBox",
          name: "jspSelectionBoxItem",
          editorType: "dxTagBox",
          visible: false,
            editorOptions: {
              dataSource: jspData,
              valueExpr: 'id',
              displayExpr: 'Name',
              searchEnabled: true,
              showSelectionControls: true,
              applyValueMode: 'useButtons'
            } 
        }]
    }, {
            itemType: "button",
            buttonOptions: {
              text: "Submit the Form",
              useSubmitBehavior: true
            }
    }],
    // onFieldDataChanged: function(e) {
    //   console.log("Inside on Change");
    //   //console.log(JSON.stringify(e.component.option("items"), null, 2));
    //   if (e.dataField === "jspSelection") {

    //     const group = e.component.option("items")[0];
    //     const nestedItems = group.items;

    //     console.log("Group: ",group);

    //     const index = nestedItems.findIndex(
    //       item => item.dataField === "jspSelectionBox"
    //     );

    //     if (index !== -1) {
    //       console.log("Item: ",group.items[index].visible);
    //       console.log("Value: ",e.value);
    //       e.component.itemOption(
    //         "group.items[6]",
    //         "visible",
    //         e.value
    //       );
    //       console.log("Item: ",group.items[index].visible);
    //     }

    //     if (!e.value) {
    //       e.component.updateData("jspSelectionBox", []);
    //     }
    //   }
    // }
    onFieldDataChanged: function(e) {
      if (e.dataField === "jspSelection") {

        const form = e.component;
        const items = form.option("items");
        const group = items[0];

        // Find your field
        const index = group.items.findIndex(
          item => item.dataField === "jspSelectionBox"
        );

        if (index !== -1) {

          // ✅ Reassign the entire item (this forces re-render)
          group.items[index] = {
            ...group.items[index],
            visible: e.value
          };

          // ✅ Re-apply items to form (forces refresh)
          form.option("items", items);
        }

        if (!e.value) {
          form.updateData("jspSelectionBox", []);
        }
      }
    }
      
  }).dxForm("instance");

});

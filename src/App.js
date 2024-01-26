import React, {useState, useEffect} from "react";
import grapesjs from "grapesjs";
import "grapesjs/dist/css/grapes.min.css";
import "./style/main.css"

function App() {


  useEffect(() => {
    loadGrapesJs();
  }, []);

  const loadGrapesJs = async() => {
    const editor = await grapesjs.init({
      container: "#gjs",
      fromElement: true,
   
      height: '580px',
      width: 'auto',
      
      storageManager: false,
      
      panels: { defaults: [
        {
          id: 'panel-switcher',
          el: '.panel__switcher',
          buttons: [{
              id: 'show-layers',
              active: true,
              label: 'Layers',
              command: 'show-layers',
              
              togglable: false,
            }, {
              id: 'show-style',
              active: true,
              label: 'Styles',
              command: 'show-styles',
              togglable: false,
          }],
        }
      ] },

      selectorManager: {
        appendTo: '.styles-container'
      },
      styleManager: {
        appendTo: '.styles-container',
        sectors: [{
            name: 'Dimension',
            open: false,

            buildProps: ['width', 'min-height', 'padding'],

            properties: [
              {
                // Type of the input,
                // options: integer | radio | select | color | slider | file | composite | stack
                type: 'integer',
                name: 'The width', // Label for the property
                property: 'width', // CSS property (if buildProps contains it will be extended)
                units: ['px', '%'], // Units, available only for 'integer' types
                defaults: 'auto', // Default value
                min: 0, // Min value, available only for 'integer' types
              }
            ]
          },{
            name: 'Extra',
            open: false,
            buildProps: ['background-color', 'box-shadow', 'custom-prop'],
            properties: [
              {
                id: 'custom-prop',
                name: 'Custom Label',
                property: 'font-size',
                type: 'select',
                defaults: '32px',
                // List of options, available only for 'select' and 'radio'  types
                options: [
                  { value: '12px', name: 'Tiny' },
                  { value: '18px', name: 'Medium' },
                  { value: '32px', name: 'Big' },
                ],
             }
            ]
          }]
      },

      blockManager: {
        appendTo: '#blocks',
        blocks: [
          {
            id: 'section', 
            label: '<b>Section</b>', 
            attributes: { class:'gjs-block-section' },
            content: `<section>
              <h1>This is a simple title</h1>
              <div>This is just a Lorem text: Lorem ipsum dolor sit amet</div>
            </section>`,
          }, {
            id: 'text',
            label: 'Text',
            content: '<div data-gjs-type="text">Insert your text here</div>',
          }, {
            id: 'image',
            label: 'Image',
            
            select: true,
            
            content: { type: 'image' },

            activate: true,
          }
        ]
      },

      layerManager: {
        appendTo: '.layers-container'
      },
      panels: {
        defaults: [{
          id: 'layers',
          el: '.panel__right',
          resizable: {
            maxDim: 350,
            minDim: 200,

            tc: 0, 
            cl: 1, 
            cr: 0, 
            bc: 0, 

            keyWidth: 'flex-basis',
          },
        }]
      },
    });

    editor.Panels.addPanel({
      id: 'panel-top',
      el: '.panel__top',
    });
    editor.Panels.addPanel({
      id: 'basic-actions',
      el: '.panel__basic-actions',
      buttons: [
        {
          id: 'visibility',
          active: true, // active by default
          className: 'btn-toggle-borders',
          label: '<u>B</u>',
          command: 'sw-visibility', // Built-in command
        }, {
          id: 'export',
          className: 'btn-open-export',
          label: 'Exp',
          command: 'export-template',
          context: 'export-template', // For grouping context of buttons from the same panel
        }, {
          id: 'show-json',
          className: 'btn-show-json',
          label: 'JSON',
          context: 'show-json',
          command(editor) {
            editor.Modal.setTitle('Components JSON')
              .setContent(`<textarea style="width:100%; height: 250px;">
                ${JSON.stringify(editor.getComponents())}
              </textarea>`)
              .open();
          },
        }
      ],
    });

    editor.Commands.add('show-layers', {
      getRowEl(editor) { return editor.getContainer().closest('.editor-row'); },
      getLayersEl(row) { return row.querySelector('.layers-container') },
    
      run(editor, sender) {
        const lmEl = this.getLayersEl(this.getRowEl(editor));
        lmEl.style.display = '';
      },
      stop(editor, sender) {
        const lmEl = this.getLayersEl(this.getRowEl(editor));
        lmEl.style.display = 'none';
      },
    });
    editor.Commands.add('show-styles', {
      getRowEl(editor) { return editor.getContainer().closest('.editor-row'); },
      getStyleEl(row) { return row.querySelector('.styles-container') },
    
      run(editor, sender) {
        const smEl = this.getStyleEl(this.getRowEl(editor));
        smEl.style.display = '';
      },
      stop(editor, sender) {
        const smEl = this.getStyleEl(this.getRowEl(editor));
        smEl.style.display = 'none';
      },
    });
  }

  return (
    <>
      <div class="panel__top">
        <div class="panel__basic-actions"></div>
        <div class="panel__switcher"></div>
      </div>
      <div class="editor-row">
        <div class="editor-canvas">
          <div id="gjs"></div>
        </div>
        <div class="panel__right">
          <div class="layers-container"></div>
          <div class="styles-container"></div>
        </div>
      </div>
      <div id="blocks"></div>
    </> 
  );
}

export default App;

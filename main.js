const electron = require('electron');
const url = require('url');
const path = require('path');

// Components from Electron
const { app, BrowserWindow, Menu, TouchBar } = electron;
const { ipcMain } = require('electron')

const { TouchBarButton, TouchBarLabel, TouchBarSlider } = TouchBar

let mainWindow;

const speedSlider = new TouchBarSlider({
  label: 'Speed',
  value: 50,
  minValue: 0,
  maxValue: 100,
  change: (val) => mainWindow.webContents.send('slider:speed:fromTB', val),
})

const itrSlider = new TouchBarSlider({
  label: 'Iterations',
  value: 5,
  minValue: 1,
  maxValue: 75, change: (val) => mainWindow.webContents.send('slider:itr:fromTB', val),

})

const btn_square = new TouchBar.TouchBarButton({
  label: 'Square',
  click: () => {
    mainWindow.webContents.send('waveform:fromTB', 'square');
  }
})

const btn_sawtooth = new TouchBar.TouchBarButton({
  label: 'Sawtooth',
  click: () => {
    mainWindow.webContents.send('waveform:fromTB', 'sawtooth');
  }
})

const btn_triangle = new TouchBar.TouchBarButton({
  label: 'Triangle',
  click: () => {
    mainWindow.webContents.send('waveform:fromTB', 'triangle');
  }
})

const btn_clausen = new TouchBar.TouchBarButton({
  label: 'Clausen',
  click: () => {
    mainWindow.webContents.send('waveform:fromTB', 'clausen');
  }
})

const touchBar = new TouchBar([
  speedSlider,
  itrSlider,
  new TouchBar.TouchBarPopover({
    label: 'Waveforms',
    items: new TouchBar([
      btn_square,
      btn_sawtooth,
      btn_triangle,
      btn_clausen,
    ])
  })
])

// Catch slider:itr:toTB
ipcMain.on('slider:itr:toTB', function (e, arg) {
  itrSlider.value = arg;
})


// Catch slider:speed:toTB
ipcMain.on('slider:speed:toTB', function (e, arg) {
  speedSlider.value = arg;
})


// Listen for app to be ready
app.on('ready', function () {
  // Create new windows
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 950,
    minHeight: 1000,
    minWidth: 1100,
  });
  // Disable menu bar
  mainWindow.setMenuBarVisibility(false);
  // Add TouchBar support
  mainWindow.setTouchBar(touchBar)
  // Load html into window
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'fourierSeries.html'),
    protocol: 'file:',
    slashes: true
  }));
  // Quit app when closed
  mainWindow.on('closed', function () {
    app.quit();
  });

});
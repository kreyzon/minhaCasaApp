/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();
/*modal de login*/
var dialog = document.querySelector('#login-dialog');
var showDialogButton = document.querySelector('#show-login');
   if (! dialog.showModal) {
     dialogPolyfill.registerDialog(dialog);
   }
   showDialogButton.addEventListener('click', function() {
     dialog.showModal();
   });
   dialog.querySelector('.close').addEventListener('click', function() {
     dialog.close();
   });

/*modal de loading*/
var dialogLoading = document.querySelector('#loading-dialog');
if (! dialogLoading.showModal) {
    dialogPolyfill.registerDialog(dialogLoading);
}
var showDoLoginButton = document.querySelector('#do-login');

showDoLoginButton.addEventListener('click', function() {
  dialogLoading.showModal();
  setTimeout(function () {}, 1000);
});

/*modal de incluir itens lista compra*/
var dialogItemCompra = document.querySelector('#itemcompra-dialog');
if (! dialogItemCompra.showModal) {
    dialogPolyfill.registerDialog(dialogItemCompra);
}
var showAddItemCompraButton = document.querySelector('#btAddItemCompra');
showAddItemCompraButton.addEventListener('click', function() {
    carregarCategorias();
  dialogItemCompra.showModal();
});

dialogItemCompra.querySelector('.close').addEventListener('click', function() {
  dialogItemCompra.close();
});

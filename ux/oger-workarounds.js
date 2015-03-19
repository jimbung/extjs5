/*
#LICENSE BEGIN
#LICENSE END
*/





// workarounds for extjs bugs
//////////////////////////////

// [4.0.2a] Ext.Date.defaultFormat is used at define time in Ext.grid.column.Date
// should be fixed in 4.0.7 but is not (at least not in 4.0.7 gpl)
// so force Ext.Date.defaultFormat to 'd.m.Y' independend of following problems in internationalisation
// Now done in ext-lang-de.js, so it is here only for documentation
//Ext.Date.defaultFormat = 'd.m.Y';


// in 4.1.0 the altFormat Y-m-d is not set
// Now done in ext-lang-de.js, so it is here only for documentation
//Ext.form.field.Date.altFormats = Ext.form.field.Date.altFormats + "|Y-m-d";


// the datepicker is set to startday 1 (monday) but datefield not so the
// datepicker setting is overwritten for datepickers of datefields
// Now done in ext-lang-de.js, so it is here only for documentation
//Ext.form.field.Date.startDay = 1;


/*
 * Show warning if ajax response is empty.
 * By closure via an anonymous function.
 */
(function() {

  var originalFunc = Ext.data.Connection.prototype.createResponse;

  Ext.override(Ext.data.Connection, {

    createResponse: function() {

			// perform preprocessing
      // arguments[0].xhr.responseText = '{ "success": false, "msg": "Empty response from server." }';
			// request (arguments[0]) is immutable - so no chance to change here
			// it is enough to change the response object, because the original function
			// mainly transfers the xhr values from browser xhr object to the extjs-response object


      //call the original function
      var response = originalFunc.apply(this, arguments);


      //perform post-processing.
      if (!(response.responseText || response.responseXML)) {
        /*
         * show details - disabled for now
        var params = response.request.options.params;
        var paramStr = '';
        for (prop in params) {
          paramStr += prop + '=' + params[prop] + ', ';
        }
        Ext.create('Ext.window.MessageBox').alert(
          'Warning',
          'Empty response from server (changed to success=false now). ' +
            'Url: ' + response.request.options.url +
            '; Params: ' + paramStr +
            '.');
        */
        // this should result in calling extjs failure listeners
        response.responseText = '{ "success": false, "msg": "Empty response from server." }';
      }


			// check for invalid json in response text if no xml present
			if (!response.responseXML) {
				var tmpDecode = Ext.JSON.decode(response.responseText, true);
				if (tmpDecode === null) {
					response.responseText = '{ "success": false, "msg": "Invalid Json from server." }';
				}
			}


      // return the return-value from the original function
      return response;
    }
  });
})();

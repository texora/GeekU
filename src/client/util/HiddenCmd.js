'use strict'

/**
 * Encapsulates the Hidden Command utility (an Easter Egg
 * implementation) that listens for browser keystrokes that make up
 * commands that are registered to self.
 * 
 * @api public
 * @author Kevin Bridges
 */
class HiddenCmd {


  /**
   * Registers the supplied command to the defined function.  When this
   * command is entered, the supplied function will be invoked.
   *
   * @param {String} cmd the command string to register.  Any case is
   * acceptable, as the command-matching algorithm is case insensitive.
   * @param {function} cmdFunct the function to execute when this
   * command is entered.
   */
  static register(cmd, cmdFunct) {
    // register this new command
    HiddenCmd.cmds.push( { str:          cmd.toLowerCase(),
                           curMatchIndx: 0,
                           funct:        cmdFunct });
  }

  /**
   * Registers the supplied command to the defined function.  When this
   * command is entered, the supplied function will be invoked.
   *
   * @param {Event} event the event supplied by the keystroke listener.
   * @private
   */
  static cmdProcessor(event) {

    // FF supplies the event parameter, IE uses window.event (slightly dif obj)
    if (!event) event = window.event;
    var keyCode  = (event.which) ? event.which : event.keyCode;
    var asciiKey = String.fromCharCode(keyCode).toLowerCase();

    // console.log("You Pressed: '" + asciiKey + "'");

    // process each registered command
    for (var i=0; i<HiddenCmd.cmds.length; i++) {
      var cmd = HiddenCmd.cmds[i];

      // when the entered char matches the next char in our command ...
      if (asciiKey == cmd.str.charAt(cmd.curMatchIndx)) {
        // bump up our counter
        cmd.curMatchIndx++;

        // if the entire command has been entered ...
        if (cmd.curMatchIndx >= cmd.str.length) {
          cmd.funct();          // invoke the registered function
          cmd.curMatchIndx = 0; // reset our counter (to catch the comman again)
        }
      }
      else { // if no match, reset our counter (to keep looking for the command)
        cmd.curMatchIndx = 0;
      }
    }
  }

} // end of ... class HiddenCmd

/**
 * The registered commands that will be recognized.
 *
 * Each cmd instance has the following properties:
 *  - str: {String) - The command string (lowercase).
 *  - curMatchIndx: {int} - The running index matching the current keystrokes.
 *  - funct: {function} - The function to execute when the command is recognized.
 *
 * type Cmd[] (see structure above)
 */
HiddenCmd.cmds = [];

// register our event listener for keystrokes
const originalEvent = window.onkeypress;
window.onkeypress = (event) => {
  if (originalEvent) {
    originalEvent(event);
  }
  HiddenCmd.cmdProcessor(event);
}

export default HiddenCmd

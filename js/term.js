
var commands = {
  help: function(term) {
    term.writeln( "Welcome to MyuOS!" );
    term.writeln( "All one-line JavaScript here works." );
    term.writeln( "You can also use the following commands:" );
    term.writeln( "help, double" );
  },

  double: function(term) {
    term.writeln( "cheezeburger" );
  }
}

function try_commands(term, current_command)
{
  if (commands[current_command])
  {
    commands[current_command](term)
    return true;
  }
  return false;
}

function begin_terminal(term)
{
  var current_command = ""
  term.write("みゅ$ ");

  term.on('data', function(data) {
    if (data.charCodeAt(0) === 13) {
      term.writeln('');
      try {
        if (!try_commands(term, current_command))
        {
          term.writeln( "\u001b[38;5;10m" +  eval(current_command) + "\033[0m" );
        }
      }
      catch (e) {
        term.writeln( "\033[1;3;31m" + e + "\033[0m");
      }
      current_command = ""
      term.write("みゅ$ ");
      return false;
    }
    if (data.charCodeAt(0) === 27) {
      if (data.charCodeAt(2) === 65)
      {
        // up
      }
      else if (data.charCodeAt(2) === 66)
      {
        // down
      }
      return false;
    }
    else if (data.charCodeAt(0) === 127) {
      if (current_command.length != 0)
      {
        term.write('\x08');
        term.write(' ');
        term.write('\x08');
        current_command = current_command.slice(0, -1);
      }
      return false;
    }
    else {
      term.write(data);
      current_command += data;
    }
  });
}
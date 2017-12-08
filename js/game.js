debug=0

var game_state = {
  name: "init",
  ctx: undefined,
  level: 0,

  clicked_place: {x:0, y:0},
  clicked: {gx:0,gy:0},
  click_listener: function(){},

  board_state: [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],

  board_clicked_state: [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],

  clicked_list: [],

  level_clear_start: 0

}

var styles = {
  green: ["lightgreen", "green", "green"],
  green_clicked: ["darkgreen", "green", "green"],
  red: ["pink", "red", "red"],
  red_clicked: ["darkred", "red", "red"],
  blue: ["lightblue", "blue", "blue"],
  blue_clicked: ["darkblue", "blue", "blue"],
  fluorescent: ["magenta", "blue", "red"],
  fluorescent_clicked: ["red", "blue", "magenta"]
}

var levels = [
  function level0() {
    game_state.board_state[0][0] = "green"
  },

  function level1() {
    game_state.board_state[0][0] = "red"
    game_state.board_state[0][1] = "blue"
  }
]

function start_game(canvas)
{
  var ctx = canvas.getContext("2d");
  game_state.ctx = ctx;

  game_state.ctx.font="20px Georgia";

  canvas.addEventListener('click', process_click, false);
  window.requestAnimationFrame(step);

  enter_start_level_state();
}

// STATES

function enter_start_level_state()
{
  reset_board_state();
  levels[game_state.level]();
  enter_board_state();
}

function enter_board_state()
{
  game_state.name = "board"
  game_state.click_listener = function() {
    game_state.board_clicked_state[game_state.clicked.gy][game_state.clicked.gx] = 1

    if (game_state.board_state[game_state.clicked.gy][game_state.clicked.gx] != 0)
    {
      game_state.clicked_list.push({gx: game_state.clicked.gx, gy: game_state.clicked.gy})
    }

    if (game_state.board_state[game_state.clicked.gy][game_state.clicked.gx] === "green")
    {
      enter_level_clear_state();
    }
    else
    {
      enter_board_clicked_state();
    }
  }
}

function enter_board_clicked_state()
{
  game_state.name = "board_clicked"
  game_state.click_listener = function() {}
  if (game_state.clicked_list.length == 2)
  {
    enter_board_combining_state();
  }
}

function enter_board_combining_state()
{
  game_state.name = "board_combining"
  game_state.click_listener = function() {}

  // resolve colors
  var btn1 = game_state.board_state[game_state.clicked_list[0].gy][game_state.clicked_list[0].gx]
  var btn2 = game_state.board_state[game_state.clicked_list[1].gy][game_state.clicked_list[1].gx]

  if (btn1 == "red" && btn2 == "blue" || btn1 == "blue" && btn2 == "red")
  {
    game_state.board_state[game_state.clicked_list[0].gy][game_state.clicked_list[0].gx] = 0
    game_state.board_state[game_state.clicked_list[1].gy][game_state.clicked_list[1].gx] = "green"
  }

  game_state.board_clicked_state = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]

  game_state.clicked_list = [];
  enter_board_state();

}

function enter_level_clear_state()
{
  game_state.name = "level_clear"
  game_state.click_listener = function() {}
  game_state.level_clear_start = new Date() / 1000;
}

function enter_victory_state()
{
  game_state.name = "victory"
  game_state.click_listener = function() {}
}

// DRAWING

function draw_ok_button(ctx)
{
  var gradient=ctx.createLinearGradient(100,210,100,330);
  gradient.addColorStop("0","yellow");
  gradient.addColorStop("0.5","green");
  gradient.addColorStop("1.0","darkgreen");
  ctx.fillStyle=gradient;
  roundRect(ctx, 100, 210, 120, 30, 5, true, false)
  ctx.fillStyle="#000000";
  ctx.fillText("OK", 146, 231);
}

function draw_button(ctx,gx,gy,style)
{
  style = style || "fluorescent"
  var gradient=ctx.createLinearGradient(gx*80,gy*80,gx*80,gy*80+70);
  gradient.addColorStop("0",styles[style][0]);
  gradient.addColorStop("0.5",styles[style][1]);
  gradient.addColorStop("1.0",styles[style][2]);
  // Fill with gradient
  ctx.fillStyle=gradient;

  roundRect(ctx, gx*80 + 5, gy*80 + 5, 70, 70, 10, true, false);
}

function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
  if (typeof stroke == 'undefined') {
    stroke = true;
  }
  if (typeof radius === 'undefined') {
    radius = 5;
  }
  if (typeof radius === 'number') {
    radius = {tl: radius, tr: radius, br: radius, bl: radius};
  } else {
    var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
    for (var side in defaultRadius) {
      radius[side] = radius[side] || defaultRadius[side];
    }
  }
  ctx.beginPath();
  ctx.moveTo(x + radius.tl, y);
  ctx.lineTo(x + width - radius.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  ctx.lineTo(x + width, y + height - radius.br);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
  ctx.lineTo(x + radius.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  ctx.lineTo(x, y + radius.tl);
  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  ctx.closePath();
  if (fill) {
    ctx.fill();
  }
  if (stroke) {
    ctx.stroke();
  }
}

// STUFF

function next_level_button(e)
{
  if (game_state.clicked_place.x > 100 && 
      game_state.clicked_place.x < 220 && 
      game_state.clicked_place.y > 210 && 
      game_state.clicked_place.y < 240)
  {
    game_state.level++;
    if (levels[game_state.level] === undefined)
    {
      enter_victory_state();
    }
    else
    {
      enter_start_level_state();
    }
  }
}

function step(timestamp)
{
  game_state.ctx.fillStyle="#000000";
  game_state.ctx.fillRect(0,0,400,600);

  if (game_state.name.indexOf("board") != -1)
  {
    var gx=0,gy=0;
    for (gx=0; gx<4; gx++)
    {
      for (gy=0; gy<6; gy++)
      {
        if (game_state.board_state[gy][gx] !== 0)
        {
          if (game_state.board_clicked_state[gy][gx])
          {
            draw_button(game_state.ctx, gx, gy, game_state.board_state[gy][gx]+"_clicked")
          }
          else
          {
            draw_button(game_state.ctx, gx, gy, game_state.board_state[gy][gx])
          }
        }
      }
    }
  }

  if (game_state.name === "board_clicked")
  {
    enter_board_state();
  }

  if (game_state.name === "level_clear")
  {
    var amt = ( (new Date() / 1000) - game_state.level_clear_start ) ;

    var wait = 1.2;
    if (amt > wait)
    {
      draw_ok_button(game_state.ctx);
      game_state.click_listener = next_level_button
    }

    if (amt > 1)
    {
      amt = 1;
    }
    game_state.ctx.fillStyle='rgba(255,255,255,'+amt+')'; 

    game_state.ctx.fillText("Level "+game_state.level+" CLEAR!", 90, 200)

  }

  if (game_state.name === "victory")
  {
    game_state.ctx.fillStyle='#fff'; 
    game_state.ctx.fillText("You win! Congratulations!", 45, 200)
  }

  if (debug)
  {
    game_state.ctx.font="20px Georgia";
    game_state.ctx.fillStyle="#ffffff";
    game_state.ctx.fillText(
      game_state.name + " " + 
      game_state.clicked_list[0] + " " + 
      game_state.clicked_list[1], 10, 498)
  }

  window.requestAnimationFrame(step);
}

function process_click(e)
{
  game_state.clicked.gx = Math.floor(e.offsetX/80);
  game_state.clicked.gy = Math.floor(e.offsetY/80);
  game_state.clicked_place.x = e.offsetX;
  game_state.clicked_place.y = e.offsetY;
  setTimeout(game_state.click_listener(), 0);
  //console.log(game_state)
}

function reset_board_state() {
  game_state.board_state = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]

  game_state.board_clicked_state = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]

  game_state.clicked_list = []
  game_state.clicked = {gx:-1, gy:-1}
}

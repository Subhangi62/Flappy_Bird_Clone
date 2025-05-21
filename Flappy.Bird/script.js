let move_speed = 3,
  gravity = 0.5;

let bird = document.querySelector('.bird');
let bird_props = bird.getBoundingClientRect();
let background = document.querySelector('.background').getBoundingClientRect();
let score_val = document.querySelector('.score_value');
let message = document.querySelector('.message');
let score_title = document.querySelector('.score_title');

let game_state = 'Start';
let bird_dy = 0;
message.classList.add('messagestyle');

// Start game on Enter
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && game_state !== 'Play') {
    document.querySelectorAll('.pipe_sprite').forEach((e) => e.remove());
    bird.style.top = '40vh';
    game_state = 'Play';
    message.innerHTML = '';
    score_title.innerHTML = 'Score: ';
    score_val.innerHTML = '0';
    message.classList.remove('messagestyle');
    play();
  }
});

function play() {
  bird_dy = 0;
  let pipe_separation = 0;
  let pipe_gap = 35;

  function move() {
    if (game_state !== 'Play') return;

    let pipe_sprites = document.querySelectorAll('.pipe_sprite');
    pipe_sprites.forEach((element) => {
      let pipe_props = element.getBoundingClientRect();
      bird_props = bird.getBoundingClientRect();

      if (pipe_props.right <= 0) {
        element.remove();
      } else {
        // Collision detection
        if (
          bird_props.left < pipe_props.left + pipe_props.width &&
          bird_props.left + bird_props.width > pipe_props.left &&
          bird_props.top < pipe_props.top + pipe_props.height &&
          bird_props.top + bird_props.height > pipe_props.top
        ) {
          gameOver();
          return;
        } else {
          if (
            pipe_props.right < bird_props.left &&
            pipe_props.right + move_speed >= bird_props.left &&
            element.increase_score === '1'
          ) {
            score_val.innerHTML = parseInt(score_val.innerHTML) + 1;
            element.increase_score = '0';
          }
          element.style.left = pipe_props.left - move_speed + 'px';
        }
      }
    });

    requestAnimationFrame(move);
  }

  function apply_gravity() {
    if (game_state !== 'Play') return;

    bird_dy += gravity;
    bird.style.top = bird.offsetTop + bird_dy + 'px';
    bird_props = bird.getBoundingClientRect();

    // End game if hits top or bottom
    if (bird_props.top <= 0 || bird_props.bottom >= background.bottom) {
      gameOver();
      return;
    }

    requestAnimationFrame(apply_gravity);
  }

  function create_pipe() {
    if (game_state !== 'Play') return;

    pipe_separation++;
    if (pipe_separation > 115) {
      pipe_separation = 0;

      let pipe_posi = Math.floor(Math.random() * 43) + 8;

      // Upper Pipe
      let pipe_sprite_inv = document.createElement('div');
      pipe_sprite_inv.className = 'pipe_sprite';
      pipe_sprite_inv.style.height = pipe_posi + 'vh';
      pipe_sprite_inv.style.top = '0vh';
      pipe_sprite_inv.style.left = '100%';
      pipe_sprite_inv.style.zIndex = '5';
      document.querySelector('.background').appendChild(pipe_sprite_inv);

      // Lower Pipe
      let pipe_sprite = document.createElement('div');
      pipe_sprite.className = 'pipe_sprite';
      pipe_sprite.style.height = 100 - pipe_posi - pipe_gap + 'vh';
      pipe_sprite.style.top = pipe_posi + pipe_gap + 'vh';
      pipe_sprite.style.left = '100%';
      pipe_sprite.increase_score = '1';
      pipe_sprite.style.zIndex = '5';
      document.querySelector('.background').appendChild(pipe_sprite);
    }

    requestAnimationFrame(create_pipe);
  }

  // Controls
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') {
      bird_dy = -7.6;
    }
  });

  requestAnimationFrame(move);
  requestAnimationFrame(apply_gravity);
  requestAnimationFrame(create_pipe);
}

function gameOver() {
  game_state = 'End';
  message.innerHTML = 'Game Over'.fontcolor('red') + '<br>Press Enter to Restart';
  message.classList.add('messagestyle');
}

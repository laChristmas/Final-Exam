# COMP6080 Final Exam

For this exam you are provided with this public repostory (`exam-spec`) that all students have access to. This repository contains the questions being asked. You will then also have your own [personal exam repository](https://cgi.cse.unsw.edu.au/~cs6080/gitlabredir/25T3/exam) where you actually complete the work that will be submitted. The personal exam repo is where you actually commit and push your code.

If you are seeking information not provided in this file, check the [COMP6080 Exam Brief page](https://cgi.cse.unsw.edu.au/~cs6080/NOW/assessments/exam). If your question is still unanswered, follow the "Communicating with teaching staff" instructions.

## WARNING

## Change Log

## 1. The Exam

### 1.1 Overview

You are to build a small single page application (with either ReactJS or Vanilla JS) that has three basic interactive games, along with a dashboard acting as a homepage.

### 1.2. Getting Started

Please clone your [personal exam repository](https://cgi.cse.unsw.edu.au/~cs6080/gitlabredir/25T3/exam).

Run `npm create vite@latest ./` in the exam root folder to initialize the project.

Run `npm run dev` to start your ReactJS app.

You are welcome to install any dependencies on top of ReactJS that you would like using `npm install [dependency]`.

Please note: If you prefer to complete the exam with VanillaJS, then you can simply remove all files we've provided and start from an empty repo.

There is no backend in this application. The entire state you manage should be done in localstorage or another form of persistent browser storage.

### 1.2. Features

The numbers in brackets next to any items (e.g. "Make the page big (1)") describe the number of marks associated with that piece of functionality.

#### 1.2.0. Document and Navigation (11 marks)

- The overall body should have a `margin` of `0px`. (0.5)
- The navigation bar(in the following context, sometimes it is referred as navbar) should exist in a `100%` width and `100px` height box that (0.5):

  - Is in a fixed position at the bottom of the body at all times (1)
  - Has a background color of `#333` and font color of `#fff` (1)
  - Has horizontal padding of `10%` (1)
  - Has 5 equally spaced boxes(shared the remaining space of the navbar equally) which each of them has styles as below: (0.5)

    - A border of `1px solid #fff` (0.5)
    - A padding of `5px` exists between the border and the contents (0.5)
    - The following contents are the items placed in each box:
      - A logo for the application (any picture you can find on the internet that is scaled down to `20px` x `20px`) and is centered in the box. (1)
      - `Dashboard` text centered in the box (linking to /dashboard) (0.5)
      - `Guess The Number` text centered in the box (linking to /game/guessthenumber) (0.5)
      - `Tic Tac Toe` text centered in the box (linking to /game/tictactoe) (0.5)
      - `Seal The Box` text centered in the box (linking to /game/sealthebox) (0.5)

  - If the screen width drops below `1400px`, then:
    - The link's text, "Dashboard", "Guess The Number", "Tic Tac Toe", "Seal The Box" becomes "Dash", "Guess", "Tic", "Seal" (1)
    - The height of the navbar drops to `80px` (0.5)
  - If the screen width drops below `800px`, then:
    - The link's text, "Dashboard", "Guess The Number", "Tic Tac Toe", "Seal The Box" stays the same as "Dash", "Guess", "Tic", "Seal", but the height drops to `60px` (0.5)

- The entirety of the space on the page that isn't used by the navbar at the bottom is referred to as the `main body`, and screens from `1.2.1`, `1.2.2`, `1.2.3`, and `1.2.4` should occupy that full space, unless otherwise specified. This main body should have a background colour of `#000` and text colour of `#fff`. (0.5)

#### 1.2.1. Dashboard (11 marks)

- This screen exists on route `/dashboard` and contains the navbar from `1.2.0`. (0.5)

- This screen shall contain two lines of text and a reset button beneath them with the following details:

  - The content of the first line is: `Choose your option from the navbar.` And its color is `white` and font size is `3em`. (1)
  - The content for second line is: `Games you need to win: X` and styles is the same as first line, following the details below regarding `X` (1):

    - `X` should be initially set as the number getting from the JSON object (with format `{"score":5}`) at this URL: [https://cgi.cse.unsw.edu.au/~cs6080/raw/data/score.json](https://cgi.cse.unsw.edu.au/~cs6080/raw/data/score.json). (2)
    - Each time the player wins `any` of the 3 games, this number should go down by 1. For example, if the player wins the first game, and its current score is 3, then it should become 2 after that. (1)
    - The value of `X` shall persist between loads by making use of a form of browser storage (e.g. `local storage`). (2)
    - Once X reaches `0`, an alert is shown saying `Congratulations!` and after the user closes the alert popup, the value should reset to the initial value getting from the above URL. (1)

  - A reset button which has text `Reset` sits in the middle of the button and it has a background color of `#f00`, following a click reaction as below: (0.5)
    - When the user clicks on this button, the value of `X` resets to the initial value getting from the above URL regardless of its current value. (1)
  - The space between the two text lines and the distance of the two text lines to the reset button should all be `2rem` and these three rows should be placed in the middle of the main body both vertically and horizontally. (1)

#### 1.2.2. Game 1 - GuessTheNumber (17 marks)

This question is loosely based off the [guess the number game](https://www.funbrain.com/games/guess-the-number).

- This page exists on route `/game/guessthenumber` and contains the relevant components from `1.2.0`. (0.5)
- Before the game starts, the user is presented with three buttons allowing them to select a difficulty level, one button per line: `Easy`, `Medium`, `Hard`. (1)

  - Easy mode: The number to guess is random generated between `1` and `10` incluseively. The user has `20 seconds` to guess the number. (1)
  - Medium mode: The number to guess is random generated between `1` and `50` incluseively. The user has `30 seconds` to guess the number. (1)
  - Hard mode: The number to guess is random generated between `1` and `100` incluseively. The user has `60 seconds` to guess the number. (1)

- Once a difficulty level is selected, the user will be brought to another blank page presented with:
  - A message saying "I have selected a number between `X` and `Y`. Can you guess it?" where `X` and `Y` are the minimum and maximum numbers for the selected difficulty level. (1)
  - An input box where they can enter their guess (0.5)
  - A `Submit Guess` button (0.5)
  - A display showing how many time remaining in seconds, starting from the maximum time for the selected difficulty level specified above. (2)
- Game play:

  - The user can enter a number into the input box and click the `Submit Guess` button to submit their guess. (0.5)
  - Should have a validation check if the input is a valid number within the range for the selected difficulty level once the user submit a guess. If not, display an error message with color of `#f00` "Please enter a valid number between `X` and `Y`" under the line of time remaining (see above for the value interpretation of `X` and `Y`). (0.5)
    - The error message should be hidden if the input is valid. (0.5)
  - If the user's guess is incorrect, a message with color `#404040` is displayed under the line of time remaining saying:
    - `Too low! Try again.` if the guess is lower than the correct number. (0.5)
    - `Too high! Try again.` if the guess is higher than the correct number. (0.5)

- Game end:

  - The user can continue to submit guesses until they either guess the correct number or run out of time. (1)
  - If the user's guess is correct:

    - a message with color `#404040` is displayed saying "Congratulations! You've guessed the number! The time left is `time` seconds" where `time` is the remaining time the user hasn't used. (1)

  - If the user runs out of time, a message is displayed saying "Time's up! The correct number was `number`." where `number` is the correct number randomly generated. (1)
  - The user is redirected back to the landing page to choose the difficulty level again when the game ends with the corresponding message showing up for 5 seconds to restart the game. (1)
  - Should have a way to store the best score (shortest time used along with minimum guessing times) for each difficulty level in local storage. (2)

- Check feature 1.2.5 about which stats data related to this game need to be stored and displayed.
- Anything not mentioned in the specification is left to your discretion and will not be marked.

#### 1.2.3. Game 2 - Tic Tac Toe (20 marks)

This question is loosely based off the [tic tac toe game](https://playtictactoe.org/).

- This page exists on route `/game/tictactoe` and contains the relevant components from `1.2.0`. (0.5)

- This page will display `9` square containers, in a `3` by `3` configuration, each with width's of `33%` and height's of `33%`. (2)

  - The table of containers has borders between each square (`2px solid #fff`) with the exception of the very outer border. E.G. [Here](https://playtictactoe.org/). (1)

- This game consists of two players, each taking a turn. Once a player makes a click on a valid square, their turn ends, and then the other player takes a turn.
  - If it is Player 1's turn, all the non-filled squares on the board should have a background `rgb(255,220,220)`. If it is Player 2's turn, all the non-filled squares on the board should have a background `rgb(220,220,255)`. (2)
  - If Player 1 clicks on a cell while it is their turn, an `O` shall appear in the very centre of the square that is `2em` in size. If Player 2 clicks on a cell while it is their turn, an `X` shall appear in the very centre of the square that is `2em` in size. (3)
- The game is complete either when:
  - All 9 squares are filled; or
  - When there is 3 of `O` or `X` in a row horizontally, vertically, or diagonally.
- Once the game is complete, an animation occurs for `3` seconds where all the cells on the board should have their backgrounds oscillate between white (`#fff`) and black (`#000`) backgrounds every `0.5` seconds until the `3` seconds is over. (3)
- Once the game is complete, and after the animation, an overlay box should appear over the board containing:
  - A background colour of `#fff`, width of `200px` and height of `50px` (1.5)
  - The box should also contain `14pt` font-size text inside that either says "`??` wins" if a user has won, or "No one wins" if no one won. `??` is replace with either O or X (1)
  - Somewhere in this box should contain a piece of text saying "A total of `X` moves were complete" where `X` is the number of cells that either Player 1 or Player 2 has filled (number of non empty cells). Whether to show Player 1 or Player 2's moves depends on who wins the game. (1)
  - A `Play again` button that when clicked, restarts the game back to the initial state. (0.5)
  - The box should also prevent user from interacting with the table. (0.5)
- This game is considered to have been "won" when player 1(Player O) wins the game.
- Check feature 1.2.5 about which stats data related to this game need to be stored and displayed.

#### 1.2.4. Game 3 - SealTheBox (22 marks)

- This page exists on route `/game/sealthebox` and contains the navbar from 1.2.0. (0.5)

  - Some words explanations for the following specification:

    - `belt` refers to the long horizontal strip that looks like a conveyor belt moving from right to left.
    - `box` refers to the square box sitting on top of the belt that can be sealed by the user.
    - `avatar` refers to the circle picture representing the user sitting on the belt they are currently on.

- The main body contains the following components:

  - three conveyor belts with boxes on top should stack vertically with a gap of 100px in between and center in the main body(each belt with boxes on top should not be covered by other belts or other backgrounds so that user can play normally). (1)
    - The styles of each conveyor belt and some behaviors are as follows:
      - Each belt has a height of `10px` and width of 100% of the remaining screen space. (0.5)
      - Each belt has a background color of `white`. (0.5)
      - Each belt should look like it is moving in a speed of `20px/second` from right to left. (1)
      - The belt seems to be infinite scrolling, shouldn't display any blank space when scrolling. (1)
  - On each belt, there are random generated boxes that moving along with the belt. (1)

    - The box at initial stage is unsealed and there is an unsealed box image provided in assets folder to represent it. (0.5)
    - Once the user has touched the box, the box is considered "sealed" and the image should change to the sealed box image provided in assets folder (1)
    - The box size is `100px` by `100px`. (0.5)
    - The boxes sit on top of the belt, should not been covered by the belt. (0.5)
    - The boxes should appear at random space intervals on each belt, with a minimum spacing of `100px` between boxes on the same belt. (1)
    - When a box moves off the left side of the screen, it should disappear from the screen. (0.5)

  - There is an avatar(use any pic you choose as long as the size is `50px` by `50px`) representing the user is currently sitting on which belt. (1)

    - The avatar is in circle shape with diameter `50px`. (0.5)
    - The avatar is positioned on top of the belt, not been covered by the belt as well. (0.5)

- Initial State:
  - When the game just loaded, there should be three belts displayed on the screen already but not moving yet. (0.5)
  - Should have some boxes already on each belt at random positions but not moving yet. (0.5)
- Game Start:
  - The game starts when the user presses the any key on the keyboard. (0.5)
  - Once the game starts, the boxes should start moving to left. (1)
- Game Play:

  - The user can use `Arrow up` and `Arrow down` keys to switch between belts. (1)
  - If the user touches the boxes, then the boxes will be sealed if they have not yet been sealed. (1)
  - `Touching` the box means the user is currently on the same belt as the box when the box is passing by the user's avatar. As long as the right side edge of the box hasn't fully surpass the left side edge of the avatar, the box is considered to be "touched" by the user if they are on the same belt. (3)

- Game End:
  - The game ends when there are three boxes that have moved off the left side of the screen that were not sealed by the user. (1)
  - When the game ends, should display some statistics in the main body immediately including:
    - The total number of boxes that were sealed by the user during this game session. (0.5)
    - The best score(highest number of boxes sealed before) the user has achieved in all their previous game sessions. (0.5)
    - A `Play again` button that when clicked, restarts the game back to the initial state. (1)
- Check feature 1.2.5 about which stats data related to this game need to be stored and displayed.
- Anything not mentioned in the specification is left to your discretion and will not be marked.

#### 1.2.5. Stats Panel (12.5 marks)

- A button exists always on the top right corner on every screen of the app(dashboard and the games) with the text "Stats" sits in center (1)
- When clicked, it will display the stats panel page with route path `/statspanel` (1)
- The page will display:

  - For Guess the Number game, display:
    - The best score(longest remaining time left) user has achieved in Guess The Number game for each difficulty level. (1 per level, 3 total)
    - The correct guessing ratio for each difficulty level. e.g.: Easy level: X/Y (X is the number of times user guessed correctly, Y is the total number of times user played this level) (0.5 per level, 1.5 total)
  - For Tic Tac Toe game, display:
    - How many times each player has won in Tic Tac Toe game. e.g.: Player1 has won: X(X is the total number of wins for player1)(0.5 per player, 1 total)
    - The ratio of each player's wins to total games played in Tic Tac Toe game. e.g.: Player1 win ratio: X/Y(X is the number of times player1 won, Y is the total number of games played) (0.5 per player, 1 total)
  - For Seal The Box game, display:
    - The best score for Seal The Box game which is to display the highest number of boxes sealed ever. (1)
  - Stats that would show some general information across all three games:
    - The number of times each game has been played. (0.5 per game, 1.5 total)
    - The average time spent on each game(time spent on each game in total / number of times played for each game). (0.5 per game, 1.5 total)

- The specific styling details for this feature is not marked.

### 1.3. Other notes

- If we don't specify a constraint, then you have discretion as to what to do, assuming it still ensures that your application is usable and accessible.
- If a CSS property constraint is not specified (e.g. font size) then you are free to use whatever is reasonable and usable.
- While we don't specify many requirements around usability and accessibility, you should take initiative to make your work both usable and accessible to gain the marks in that area.
- You should ensure that your programs have been tested on the latest version of Google Chrome

## 2. Marking Criteria

For each of sections, marks will be awarded according to the following criteria:

- 80%: Providing the features and functionality required in at least one of desktop, tablet, or mobile views.
- 20%: Ensuring responsiveness on desktop, tablet, and mobile
  - Desktop testing will be done on a `1800px` x `800px` viewport size
  - Tablet testing will be done on a `1200px` x `500px` viewport size
  - Mobile testing will be done on a `600px` x `500px` viewport size

## 3. Submission

At the end of your specified exam time, we will automatically collect the code on your `master` branch's HEAD (i.e. latest commit).

## 4. Originality of Work

The work you submit must be your own work. Submission of work partially or completely derived from any other person or jointly written with any other person is not permitted.

The penalties for such an offence may include negative marks, automatic failure of the course and possibly other academic discipline. Assignment submissions will be examined both automatically and manually for such submissions.

Relevant scholarship authorities will be informed if students holding scholarships are involved in an incident of plagiarism or other misconduct.

Do not provide or show your assignment work to any other person — apart from the teaching staff of COMP6080.

If you knowingly provide or show your assignment work to another person for any reason, and work derived from it is submitted, you may be penalized, even if the work was submitted without your knowledge or consent. This may apply even if your work is submitted by a third party unknown to you.

Note you will not be penalized if your work has the potential to be taken without your consent or knowledge.

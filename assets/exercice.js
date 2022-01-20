    const tiles = Array.from(document.querySelectorAll('.tile'));
    const playerDisplay = document.querySelector('.display-player');
    const resetButton = document.querySelector('#reset');
    const tour = document.querySelector('.tour');
    const message = document.querySelector('.announcer');
    const changeGameButton = document.querySelector('#changegame');

    let board = ['', '', '', '', '', '', '', '', '', '', '','', '', '', '', '', '', '', '', '', '', '','', '', '', '', '', '', '', '', '', '', '','','','','','','','','',''];
    let currentPlayer = 'X';
    let isGameActive = true;
    const PLAYERX_WON = 'PLAYERX_WON';
    const PLAYERO_WON = 'PLAYERO_WON';
    const TIE = 'TIE';
    let gametype;
    
    const winningConditions = [
        //les victoires horizontales
        [0, 1, 2, 3],[1, 2, 3, 4],[2 ,3, 4, 5],[3, 4, 5, 6],                   
        [7, 8, 9, 10],[8, 9, 10, 11],[9, 10, 11, 12],[10, 11, 12, 13],
        [14, 15, 16, 17],[15, 16, 17, 18],[16, 17, 18, 19],[17, 18, 19, 20],
        [21, 22, 23, 24],[22, 23, 24, 25],[23, 24, 25, 26],[24, 25, 26, 27],
        [28, 29, 30, 31],[29, 30, 31, 32],[30, 31, 32, 33],[31, 32, 33, 34],
        [35, 36, 37, 38],[36, 37, 38, 39],[37, 38, 39, 40],[38, 39, 40, 41],
        //les victoires verticales
        [0,7,14,21],[7,14,21,28],[14,21,28,35],
        [1,8,15,22],[8,15,22,29],[15,22,29,36],
        [2,9,16,23],[9,16,23,30],[16,23,30,37],
        [3,10,17,24],[10,17,24,31],[17,24,31,38],
        [4,11,18,25],[11,18,25,32],[18,25,32,39],
        [5,12,19,26],[12,19,26,33],[19,26,33,40],
        [6,13,20,27],[13,20,27,34],[20,27,34,41],
        //les victoires diagonales haut -> droite
        [0,8,16,24],[1,9,17,25],[2,10,18,26],[3,11,19,27],
        [7,15,23,31],[8,16,24,32],[9,17,25,33],[10,18,26,34],
        [14,22,30,38],[15,23,31,39],[16,24,32,40],[17,25,33,41],
        //les victoires diagonales haut -> gauche
        [6,12,18,24],[5,11,17,23],[4,10,16,22],[3,9,15,21],
        [13,19,25,31],[12,18,24,30],[11,17,23,29],[10,16,22,28],
        [20,26,32,38],[19,25,31,37],[18,24,30,36],[17,23,29,35]
    ];

    function random(min, max) { //random pour le cpu
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function win() {    //verifie si le joueur a gagne
        let roundWon = false;
        for (let i = 0; i <= 68; i++) { //boucle qui va lire le tableau de victoires
            const winCondition = winningConditions[i];
            const a = board[winCondition[0]];
            const b = board[winCondition[1]];
            const c = board[winCondition[2]];
            const d = board[winCondition[3]];
            if (a === '' || b === '' || c === '' || d === '') { //tant que au moins une case est vide, le programme continue
                continue;
            }
            if (a === b && b === c && c === d) { //si les trois possibilites correspondent,  
                roundWon = true;
                tiles[winCondition[0]].classList.add('winconfirm');
                tiles[winCondition[1]].classList.add('winconfirm');
                tiles[winCondition[2]].classList.add('winconfirm');
                tiles[winCondition[3]].classList.add('winconfirm');
                tour.classList.add('hide');
                break;
            }
        }

    if (roundWon) { // si tu gagnes alors tu appelles la fonction annonce
            announce(currentPlayer === 'X' ? PLAYERX_WON : PLAYERO_WON);
            isGameActive = false;
            return;
        }

    if (!board.includes('')) // egalite si il n'y plus aucune case vide et que personne n'a gagne
        announce(TIE);
    }

    function announce (type) { // annonce le gagnant
        switch(type){
            case PLAYERO_WON:
                message.innerHTML = 'Player <span class="playerO">O</span> Won';
                break;
            case PLAYERX_WON:
                message.innerHTML = 'Player <span class="playerX">X</span> Won';
                break;
            case TIE:
                message.innerText = 'Tie';
        }
        message.classList.remove('hide');
    };

    function isValidAction (tile) { //definit si la case ou tu joues est valide ou non
        if (tile.innerText === 'X' || tile.innerText === 'O'){
            return false;
        }

        return true;
    };

    function updateBoard (index){
        board[index] = currentPlayer;
    }

    function changePlayer () { //change le joueur current 
        playerDisplay.classList.remove(`player${currentPlayer}`); 
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X'; //ternaire qui definit a currentPlayer O ou X a condition si currentPlayer=== "x" vrai ou faux
        playerDisplay.innerText = currentPlayer;
        playerDisplay.classList.add(`player${currentPlayer}`);
    }

    function userAction (tile, index) { // fonction qui gere les autres fonction au clic, et qui va placer les 'pions'
        if(isValidAction(tile) && isGameActive) {
            tile.innerText = currentPlayer;
            tile.classList.add(`player${currentPlayer}`);
            updateBoard(index);
            win();
            changePlayer();
            if (gametype){
                if (currentPlayer === 'O') {
                    setTimeout(function () {
                        cpuTurn()
                    }, random(100, 500));
                }
            }
        }
    }

    function cpuTurn(){ //fonction qui va jouer au random en tant que joueur O
        let cpuArray = []
        for(let i = 0; i < tiles.length; i++){
            if(tiles[i].innerHTML == ''){
                cpuArray.push(i)
            }
        }
        let rand = random(0, cpuArray.length - 1)
        tiles[cpuArray[rand]].click()
    }

    function changeGame(){
        if(changeGameButton.innerText === 'Jouer contre CPU'){
            changeGameButton.innerText = 'Jouer 1 contre 1'
            gametype = true
            resetBoard()
        }else if (changeGameButton.innerText === 'Jouer 1 contre 1'){
            changeGameButton.innerText = 'Jouer contre CPU'
            gametype = false;
            resetBoard()
        }
    }
    

    function resetBoard () { //fonction qui va vider le tableau de jeu
        board = ['', '', '', '', '', '', '', '', '', '', '','', '', '', '', '', '', '', '', '', '', '','', '', '', '', '', '', '', '', '', '', '','','','','','','','','',''];
        isGameActive = true;
        message.classList.add('hide');
        tour.classList.remove('hide');

        if (currentPlayer === 'O') {
            changePlayer();
        }

        tiles.forEach(tile => {
            tile.innerText = '';
            tile.classList.remove('playerX');
            tile.classList.remove('playerO');
            tile.classList.remove('winconfirm')
        });
    }

    tiles.forEach( (tile, index) => {  // definit pour chaque case du tableau du jeu une variable et son index pour le tableau board a chaque click, et qui va appeler useraction
        tile.addEventListener('click', () => userAction(tile, index));
    });

    resetButton.addEventListener('click', resetBoard);

    changeGameButton.addEventListener('click', changeGame);

/**
 * Created by michaelgarrido on 9/1/14.
 */
/**
 * Created by michaelgarrido on 8/31/14.
 */

console.log()

function stateError(eventName, from, to, args, errorCode, errorMessage) {
    return 'event ' + eventName + ' was naughty :- ' + errorMessage;
}

currentState = null;

function Phase(){

    this.stateMachine = StateMachine.create({
        initial: 'Lobby',
        events: [
            { name: 'EnterSetup', from: 'Lobby', to: 'GameSetup' },
            { name: 'EnterMain', from: 'GameSetup', to: 'GameMain' },
            { name: 'EnterEnd', from: 'GameMain', to: 'GameEnd' },
            { name: 'LeaveGame', from: ['GameSetup','GameMain'], to: 'Lobby' }
        ],
        callbacks: {
            onbeforevent: function( event, from, to, options ){

            },
            onleavestate: function( event, from, to, options ){

            },
            onenterstate: function( event, from, to, options ){

            },
            onafterevent: function( event, from, to, options ){

            }
        },
        error: stateError
    });

    this.stateMachine.onEnterMain = function( event, from, to, options ){



    };

}


/*
 * onbeforego - specific handler for the go event only
 onbeforeevent - generic handler for all events
 onleavered - specific handler for the red state only
 onleavestate - generic handler for all states
 onentergreen - specific handler for the green state only
 onenterstate - generic handler for all states
 onaftergo - specific handler for the go event only
 onafterevent - generic handler for all events
 *
 * */
// fsm.current

function ActionPhase(){

    this.stateMachine = PRIZM.StateMachine.create({
        initial: 'Lobby',
        events: [
            { name: 'EnterSetup', from: 'Lobby', to: 'GameSetup' },
            { name: 'EnterMain', from: 'GameSetup', to: 'GameMain' },
            { name: 'EnterEnd', from: 'GameMain', to: 'GameEnd' },
            { name: 'LeaveGame', from: ['GameSetup','GameMain'], to: 'Lobby' }
        ],
        callbacks: {
            onbeforevent: function(){

            },
            onleavestate: function(){

            },
            onenterstate: function(){

            },
            onafterevent: function(){

            }
        },
        error: stateError
    });

}


function TurnQueue(){

    this.history = [];


}

TurnQueue.prototype = {

    //linear progression
    //cyclical
    //custom

    setProgression: function(){



    }

};


function PhaseMaster(){







}

PhaseMaster.prototype = {

    // get deepest state in state machine
    currentState: function(){

        return null;
    },

    registerViewsForEvent: function(){

    },

    // update UI & bind interactions accordingly
    setupViewsForEvent: function(){

    }

};
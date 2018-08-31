const config_new = require ("./config_LOTK.json");
const Discord = require("discord.js");
const client = new Discord.Client();
const mysql = require("mysql"); 

let messageArray;
let command;
let verification;
let username;

//mysql
var pool = mysql.createPool({
	//connectionLimit: 10,
	host: `${config_new.host}`,
	user: `${config_new.user}`,
	password: `${config_new.password}`,
	database: `${config_new.database}`
});

//start up 
client.on('ready', () =>
{
	console.log('Ready!'); 
});

client.on('message', message => 
{
	//Reutrn if authored by bot 
	if (message.author.bot) return; 

	if (message.content == `${config_new.prefix}showReplies`)
	{
	
		message.reply("If The Database is unaccessible: Uh oh! It seems we can't reach our main system right now :cold_sweat: Reach out a developer and tell them that the system is down, please :disappointed:");
		message.reply("If A code is Found: One Key coming right up! :grin: Make sure to check your Direct Messages!. Remember you can only ask for one key per user"); 
		message.reply("If There are no Keys Left: Oh no! :disapointed: It seems like there are no keys left. Let a Developer know!");
		message.reply ("If \"!key\" is sent but with no code, or is misspelled: Whoops! Looks like mispelled something :no_mouth:"); 
		message.reply("Woah there! My senses are telling me you already got a key there! :thinking: I'll send you your key again! If you need a new one, ask a developer!"); 
	}

	if (message.channel.type === "text")
	{
		if (!message.content.startsWith(`${config_new.prefix}`))
		return; 

		console.log(message.content);
		messageArray = message.content.split (" "); 
		command = messageArray[0]; 
		verification = messageArray[1];
		username = message.member.user.tag; 
		console.log(username); 


		if (command === `${config_new.prefix}key`)
		{
			client.channels.get(466627577344163842).send(username + " Asked for a key!");

			let discordNameSQL = "SELECT * FROM steam_keys WHERE discord_username = \"" + username + "\" LIMIT 1";
			
			pool.getConnection(function (error, tempConnection)
			{
				if (!!error) //if the database can't be reached
				{
						console.log(error); 
						message.reply("Uh oh! It seems we can't reach our main system right now :cold_sweat: Reach out a developer and tell them that the system is down, please :disappointed:");
				}

				tempConnection.query(discordNameSQL, function(err, discordNameResults)
				{
					if (discordNameResults.length == 1) //if key is found under this username, give that one.
					{
						message.reply("Woah there! My senses are telling me you already got a key there! :thinking: I'll send you your key again! If you need a new one, ask a developer!");
										
						message.author.send("You asked, again? I deliver, again! Here's one key for you, again!\n"); 
												
						message.author.send ("If you haven't used the key yet, All you have to do now is go to your Steam Library, click on \"ADD A GAME\" then, \"Activate Product on Steam\" (If you have a skin, follow the steps you need), and follow the instructions!\n" + 
						"If you do not have steam, you can install it from here: https://store.steampowered.com/about/.  The game is currently compatible on Windows platforms, with Linux and Mac Support coming soon.\n" +
						"You can check the Table Top Gods server's #getting_started and #news_and_updates channels for more information about the game, testing period and build information.\n" +
						"If you want to invite a friend to the program, let a developer know so they can tell you how to invite them.\n"); 
													
						message.author.send("Thank you for joining the testing program and we hope to hear your feedback!\n" + 
						"```Your Steam Key: " + discordNameResults[0].steam_key + "```"); 	
					}	
					
					else if (discordNameResults.length == 0) //if no key under this user exists then give a new one.
					{
						let steamKeySQL = "SELECT * FROM steam_keys WHERE key_given = 0 LIMIT 1";

						pool.getConnection(function (error, tempConnection)
						{
							if (!!error)
							{
								console.log(error); 
								message.reply("Uh oh! It seems we can't reach our main system right now :cold_sweat: Reach out a developer and tell them that the system is down, please :disappointed:");
							}

							message.reply("One Key coming right up! :grin: Make sure to check your Direct Messages!. Remember you can only ask for one key per user"); 
							tempConnection.query(steamKeySQL, function(err, steamKeyResults)
							{	
								if (err) throw err; 

								if (steamKeyResults.length == 1 && steamKeyResults) //if key is found
								{
									userlist.push(username); 	
										
									let setSteamKeyActive = "UPDATE steam_keys SET key_given = 1 WHERE steam_key = \"" + steamKeyResults[0].steam_key + "\"";
									let setSteamKeyName = "UPDATE steam_keys SET discord_username = \"" + username + "\" WHERE steam_key = \"" + steamKeyResults[0].steam_key + "\"";
											
									message.author.send("You asked? I deliver! Here's one key for you!\n"); 
												
									message.author.send ("All you have to do now is go to your Steam Library, click on \"ADD A GAME\" then, \"Activate Product on Steam\" (If you have a skin, follow the steps you need), and follow the instructions!\n" + 
									"If you do not have steam, you can install it from here: https://store.steampowered.com/about/.  The game is currently compatible on Windows platforms, with Linux and Mac Support coming soon.\n" +
									"You can check the Table Top Gods server's #getting_started and #news_and_updates channels for more information about the game, testing period and build information.\n" +
									"If you want to invite a friend to the program, let a developer know so they can tell you how to invite them.\n"); 
													
									message.author.send("Thank you for joining the testing program and we hope to hear your feedback!\n" + 
									"```Your Steam Key: " + steamKeyResults[0].steam_key + "```"); 
											

									tempConnection.query(setSteamKeyActive, function (err, steamKeyValidationResults)
									{
										if (err) throw err;
									});					
							             
									tempConnection.query(setSteamKeyName, function (err, SteamKeyName) 
									{
										if (err) throw err;
									});
								}

								else 
								{
									message.reply("Oh no! :dissapointed: It seems like there are no keys left. Let a Developer know!");
								}
							}); 
							tempConnection.release(); 
						}); 
					}

					else //if for whatever reason something goes wrong other than an error 
					{
						message.reply("Help! I've fallen and I can't get up! :head_bandage: Please call a developer")
					}
				}); 
				tempConnection.release(); 	
			}); 
		};
	}
	else
	{
		message.reply ("Whoops! Looks like mispelled something :no_mouth:"); 
	};
}); 

client.login(`${config_new.token}`);
Guild Master
============
Multi-purpose bot to manage your server, moderate your chat, manage your members, and more!
This bot will get constant updates with new features! (it's still a work in progress)

Most up to date info [here](https://guildmaster.app/docs/bot)

Commands:
---------

| Command | Description | Permission |
| --- | --- | --- |
| gm!help | Shows commands the message author can use. | None |
| gm!clear-chat \[# < 100\] | Clears all messages with the amount set. (Up to 100 and less then 14 days) | Manage Messages |
| gm!set-welcome \[On \| Banner \| Off\] \[#channel\] \[Your <member> welcome message\] | Send a welcome message when a user joins the server. Use "<member>" to @ the user. Send a welcome message when a user join the server. Use "<member>" to @ the user. If set to Banner make sure you have the image attached to the message. Recommend: 700x250px JPG \| Up to 26 characters. Note: If setting to off, you do not need to provide a channel or message. | Manage Messages |
| gm!set-welcome-roles \[@roles\] | Add a role to the user when they join. Note: Up to 5 roles. | Manage Messages |
| gm!set-prefix \[new prefix\] | Set a new prefix for the bot. Note: No spaces in the prefix. | Manage Messages |
| gm!reaction-roles \[\(Emoji = @roles\)\] \[Your Message\]	 | Allow users to give themselves roles by reacting to a message. Syntax Is important for this command e.g. `gm!reaction-roles (🔴= @Red Role) (🔵 = @Blue Role) (🟢 = @Green Role) Pick a super cool role!` | Manage Messages, Manage Roles |

\[ \] = A command variable. Do not include the "\[\]" 

### Things we are working on:
*   Spam Protection: A way to stop spam and auto delete spam.
*   Anti-Advertising: A way to remove links to other discord guilds.
*   Link Filtering: Block or allow links to specific sites.
*   Word blacklist: Block specific words.
*   Self Assign Roles: Get a roles by reacting to a message.

### The Future!
*   Economy: Get points for chatting.
*   Quests: Make quests!
*   Web portal: To help make it easier to manage your guild.
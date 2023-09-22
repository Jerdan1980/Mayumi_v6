const { InteractionType } = require("discord.js");

module.exports = {
  name: "interactionCreate",
  async execute(interaction) {
    if (interaction.type !== InteractionType.ModalSubmit) return;

    if (interaction.customId === "addRoleModal") {
      // Get the data
      const roleId = interaction.fields.getTextInputValue("roleIdInput");
      const peopleRaw = interaction.fields.getTextInputValue("peopleInput");
      await interaction.reply({ content: `Starting add-role process...` });

      // Get the role
      let role = "";
      await interaction.guild.roles
        .fetch(roleId)
        .then((r) => (role = r))
        .catch(console.error);
      if (!role) {
        interaction.followUp({ content: "Role not found!" });
        return;
      }
      console.log(role.name, role.color);

      // get the list of users
      const peopleArr = peopleRaw.split("\n");
      console.log(peopleArr);
      const memberManager = interaction.guild.members;

      // Try assigning the role to each person
      peopleArr.forEach(async (person) => {
        // Skip any empty lines
        if (!person) return;

        // Split their name into username and discriminator portions
        // 		IF they have a discriminator, it separates it
        //		otherwise, it just puts the entire thing into username
        const [username, discriminator] = person.split("#");

        // fetch() grabs people with similar usernames
        //		the query can't have a discriminator to work
        memberManager
          .fetch({ query: username, limit: 10 })
          .then(async (members) => {
            // Filter out everyone who doesn't actually have the correct information
            members.map((m) => console.log(m.displayName, m.user));
            const member = members.filter(
              (m) =>
                // try matching with the raw input first
                m.user.username === person ||
                m.user.globalName === person ||
                m.displayName === person ||
                // check if their username is their username
                m.user.username === username ||
                // check old style username + discriminator
                (m.user.username === username &&
                  m.user.discriminator === discriminator)
            );

            // Check if there is only 1 left. if not, then throw an error
            //console.log(member.size);
            if (member.size == 0) {
              await interaction.followUp({
                content: `**ERROR:** User \`${person}\` not found!`,
              });
              return;
            }
            if (member.size > 1) {
              // This should never happen but who knows
              await interaction.followUp({
                content: `**ERROR:** Multiple users match \`${person}\`:\n${member
                  .map((m) => `- ${m.displayName} (${m.user.globalName})`)
                  .join("\n")}`,
              });
              return;
            }

            // Grab the singular person and do work on them
            //console.log([...member.keys()]);
            try {
              memberManager.addRole({
                user: [...member.keys()][0],
                role: role,
              });
            } catch (e) {
              await interaction.followUp({
                content: `**ERROR:** Could not assign role to \`${person}\`! Maybe I don't have the perms?`,
              });
            }
          })
          .catch(console.error);
      });

      await interaction.followUp({
        content: "Your submission was recieved successfully!",
      });
    }
  },
};

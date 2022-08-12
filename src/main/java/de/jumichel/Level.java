package de.jumichel;

import org.bukkit.ChatColor;
import org.bukkit.command.Command;
import org.bukkit.command.CommandExecutor;
import org.bukkit.command.CommandSender;
import org.bukkit.entity.Player;

public class Level implements CommandExecutor {

    private Main plugin;
    public Level(Main main) {
        this.plugin = main;
    }

    @Override
    public boolean onCommand(CommandSender sender, Command command, String label, String[] args) {
        if(command.getName().equalsIgnoreCase("level")) {
            Player player = (Player) sender;
            int level = player.getLevel();
            if(args[0].equalsIgnoreCase("add")) {
                if (Integer.parseInt(args[1]) > 0) {
                    int level2 = level + Integer.parseInt(args[1]);
                    player.setLevel(level2);
                    player.sendMessage(ChatColor.GREEN + "Dir wurden " + args[1] + " Level hinzugefügt.");
                    return true;
                }
                if (Integer.parseInt(args[1]) < 0) {
                    int level2 = level + Integer.parseInt(args[1]);
                    player.setLevel(level2);
                    player.sendMessage(ChatColor.GREEN + "Dir wurden " + args[1] + " Level hinzugefügt.");
                    return true;
                }
                if (Integer.parseInt(args[1]) == 0) {
                    player.sendMessage(ChatColor.GREEN + "Kein level hinzugefügt.");
                    return true;
                }
            } else if(args[0].equalsIgnoreCase("replace")) {
                if (Integer.parseInt(args[1]) == 0) {
                    player.sendMessage(ChatColor.GREEN + "Kein level hinzugefügt.");
                } else {
                    player.setLevel(Integer.parseInt(args[1]));
                    player.sendMessage(ChatColor.GREEN + "Dein Level wurde auf " + args[1] + " gesetzt.");
                }
                return true;
            }
        }
        return false;
    }
}

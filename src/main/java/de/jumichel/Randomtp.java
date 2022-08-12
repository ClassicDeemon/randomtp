package de.jumichel;

import org.bukkit.*;
import org.bukkit.block.Block;
import org.bukkit.command.Command;
import org.bukkit.command.CommandExecutor;
import org.bukkit.command.CommandSender;
import org.bukkit.entity.EntityType;
import org.bukkit.entity.Pig;
import org.bukkit.entity.Player;

import java.util.Objects;


public class Randomtp implements CommandExecutor {

    private Main plugin;

    public Randomtp(Main main) {

        this.plugin = main;
    }

    @Override
    public boolean onCommand(CommandSender sender, Command command, String label, String[] args) {

        if (!(sender instanceof Player)) {
            sender.sendMessage("Sender muss ein Spieler sein!");
        } else if (command.getName().equalsIgnoreCase("Randomtp")) {

            Player player = (Player) sender;

            if(player.getLevel() >= 10) {

            int maxx = plugin.getConfig().getInt("Config.maxx");
            int minx = plugin.getConfig().getInt("Config.minx");
            int maxz = plugin.getConfig().getInt("Config.maxz");
            int minz = plugin.getConfig().getInt("Config.minz");
            int X = (int) Math.round(Math.random() * (double) (maxx - minx + 1) + (double) minx);
            int Z = (int) Math.round(Math.random() * (double) (maxz - minz + 1) + (double) minz);

            Location location = player.getLocation();
                String world = Objects.requireNonNull(location.getWorld()).getName();

            World world1 = Bukkit.getWorld((world));

            location.setX(X);
            location.setZ(Z);

            Block block = Objects.requireNonNull(world1).getHighestBlockAt(location);
            location.setY(block.getLocation().getBlockY());
            location.setY(location.getY());

            Block blockAbove = location.add(0.0,1.0,0.0).getBlock();
            while (!(blockAbove.getType().toString().equals("AIR"))) {
                location.setY(location.getY() + 1);
            }

            Block blockOver = location.subtract(0.0,1.0,0.0).getBlock();
            blockOver.setType(Material.STONE);
            location.setY(location.getY() + 1);
            location.setWorld(world1);

            player.sendMessage(ChatColor.GOLD + "°°Whoosh°°");
            player.sendMessage(ChatColor.GOLD + "-10 Level für dich!");
            player.teleport(location);
            player.setLevel((player.getLevel() - 10));
            player.playSound(location, Sound.ENTITY_ENDER_DRAGON_SHOOT, 3, 2);
            player.playEffect(location.add(0.0,1.0,0.0), Effect.PORTAL_TRAVEL, 3);

            /* Falls die Maximum und Minimum Werte so hoch sind, dass die Welt lange laden muss.
            try {
                Thread.sleep(5000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
             */

            Pig pig = (Pig) player.getWorld().spawnEntity(location, EntityType.PIG);
            player.sendMessage(ChatColor.GREEN + "Ein wildes Edga ist gespawnt!");
            pig.setCustomName("Edga");
            pig.setCustomNameVisible(true);

            return true;

        } else {
            player.sendMessage(ChatColor.RED + "Du hast nicht genügend Level, dir fehlen noch " + ChatColor.DARK_RED + (10 - player.getLevel()) +
                    ChatColor.RED + " Level.");
        }

        } else {
            return false;
        }
        return false;
    }
}

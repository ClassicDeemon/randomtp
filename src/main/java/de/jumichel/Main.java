package de.jumichel;

import org.bukkit.command.CommandExecutor;
import org.bukkit.plugin.java.JavaPlugin;

public final class Main extends JavaPlugin {

    @Override
    public void onEnable() {
        System.out.println("[RANDOMTP] Fährt hoch!");
        loadConfig();
        registerCommands();
        System.out.println("[RANDOMTP] Fertig und erfolgreich geladen!");
    }

    @Override
    public void onDisable() {
        System.out.println("[RANDOMTP] Fertig und erfolgreich entladen!");
    }

    public void loadConfig() {
        getConfig().options().copyDefaults(true);
        saveConfig();
    }

    public void registerCommands() {
        Randomtp randomtp = new Randomtp(this);
        getCommand("randomtp").setExecutor(randomtp);
        Level level = new Level(this);
        getCommand("level").setExecutor(level);
    }
}

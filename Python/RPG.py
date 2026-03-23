full_dot = '●'
empty_dot = '○'

def create_character(name, strength, intelligence, charisma):
    # --- Name validation ---
    if type(name) is not str:  # Ensures name is exactly a string
        return "The character name should be a string"
    if name == "":
        return "The character should have a name"
    if len(name) > 10:
        return "The character name is too long"
    if " " in name:
        return "The character name should not contain spaces"
    
    # --- Stats validation ---
    stats = [strength, intelligence, charisma]
    
    # Ensure all stats are integers
    for stat in stats:
        if type(stat) is not int:
            return "All stats should be integers"
    
    # Check min and max ranges
    for stat in stats:
        if stat < 1:
            return "All stats should be no less than 1"
        if stat > 4:
            return "All stats should be no more than 4"
    
    # Check sum
    if sum(stats) != 7:
        return "The character should start with 7 points"
    
    # --- Format output ---
    lines = [
        name,
        f"STR {full_dot*strength}{empty_dot*(10-strength)}",
        f"INT {full_dot*intelligence}{empty_dot*(10-intelligence)}",
        f"CHA {full_dot*charisma}{empty_dot*(10-charisma)}"
    ]
    
    return "\n".join(lines)
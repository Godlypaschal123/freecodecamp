import random

class NumberGuessingGame:
    def __init__(self):
        self.target_number = 0
        self.attempts = 0
        self.game_won = False
    
    def start_new_game(self):
        """Start a new game with a random number"""
        self.target_number = random.randint(1, 100)
        self.attempts = 0
        self.game_won = False
        print("\n" + "="*50)
        print("🎯 KIDS NUMBER GUESSING GAME 🎯")
        print("="*50)
        print("I'm thinking of a number between 1 and 100!")
        print("Can you guess what it is?")
        print("="*50)
    
    def make_guess(self, guess):
        """Process a player's guess"""
        self.attempts += 1
        
        if guess == self.target_number:
            self.game_won = True
            print(f"\n🎉 AMAZING! You got it in {self.attempts} tries!")
            print(f"The number was {self.target_number}!")
            print("🌟" * 10)
            return True
        elif guess < self.target_number:
            diff = self.target_number - guess
            if diff <= 5:
                print("🔥 Very close! Try a little higher!")
            elif diff <= 15:
                print("📈 Close! Go higher!")
            else:
                print("⬆️ Too low! Think bigger!")
        else:
            diff = guess - self.target_number
            if diff <= 5:
                print("🔥 Very close! Try a little lower!")
            elif diff <= 15:
                print("📉 Close! Go lower!")
            else:
                print("⬇️ Too high! Think smaller!")
        
        # Show encouragement
        if self.attempts <= 3:
            print("Great start! 🌟")
        elif self.attempts <= 6:
            print("Keep going! 💪")
        elif self.attempts <= 10:
            print("You're learning! 🧠")
        else:
            print("Never give up! 🏆")
        
        # Show hint after 5 attempts
        if self.attempts >= 5:
            hint = "even" if self.target_number % 2 == 0 else "odd"
            print(f"💡 Hint: The number is {hint}!")
        
        return False
    
    def play(self):
        """Main game loop"""
        self.start_new_game()
        
        while not self.game_won:
            try:
                print(f"\nAttempts: {self.attempts}")
                guess = input("Enter your guess (1-100): ")
                guess = int(guess)
                
                if guess < 1 or guess > 100:
                    print("🤔 Please enter a number between 1 and 100!")
                    continue
                
                if self.make_guess(guess):
                    break
                    
            except ValueError:
                print("🤔 Please enter a valid number!")
            except KeyboardInterrupt:
                print("\n\nThanks for playing! 👋")
                break
        
        # Ask if they want to play again
        if self.game_won:
            play_again = input("\nWant to play again? (y/n): ").lower()
            if play_again == 'y' or play_again == 'yes':
                self.play()
            else:
                print("Thanks for playing! Come back soon! 👋")

# To run the game
if __name__ == "__main__":
    game = NumberGuessingGame()
    game.play()
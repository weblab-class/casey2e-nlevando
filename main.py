# main.py

from FilteringAndPrioritizing import (
    prompt_user_preferences,
    filter_by_height,
    pick_best_ride
)
from Data_Collection import get_park_queue_times  # hypothetical import

def main():
    print("Welcome to ThrillCompass!\n")
    park_id = 64
    # 1) Fetch live queue times
    ioa_data = get_park_queue_times(park_id)
    
    # 2) Flatten the data into a list of (ride_name, wait_time)
    #    Because the JSON is in lands[].rides[], we loop
    rides_with_waits = []
    for land in ioa_data.get("lands", []):
        for ride in land["rides"]:
            ride_name = ride["name"]
            wait = ride["wait_time"] if ride["is_open"] else 0
            rides_with_waits.append((ride_name, wait))

    # 3) Extract a unique list of ride names for user preference
    unique_ride_names = [rw[0] for rw in rides_with_waits]
    
    # 4) Ask the user for preferences
    user_prefs = prompt_user_preferences(unique_ride_names)

    # 5) Ask for user height
    print("\nEnter your height in inches (e.g. 60 for 5 feet): ")
    user_height_input = input("Height (in inches): ")
    try:
        user_height = int(user_height_input)
    except ValueError:
        user_height = 0  # fallback if invalid input

    # 6) Filter out rides user can't ride
    rides_user_can_ride = filter_by_height(rides_with_waits, user_height)

    # 7) Pick the "best" ride: highest preference, then shortest wait
    best_ride_name, best_wait, best_pref = pick_best_ride(rides_user_can_ride, user_prefs)

    if best_ride_name is None:
        print("\nNo rides available under your height or no data found.")
    else:
        # 8) Display the recommendation
        print("\n--- RIDE NOW Recommendation ---")
        print(f"Ride: {best_ride_name}")
        print(f"Your Preference: {best_pref} / 5")
        print(f"Current Wait: {best_wait} minutes")

if __name__ == "__main__":
    main()

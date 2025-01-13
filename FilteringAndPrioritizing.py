# FiltersAndPriorities.py

import math

# Example dictionary for ride height requirements:
IOA_RIDE_HEIGHTS = {
    "The Incredible Hulk Coaster": 54,
    "Doctor Doom's Fearfall": 52,
    "Storm Force Accelatron": 48,
    "Jurassic Park River Adventure": 42,
    "Skull Island: Reign of Kong": 36,
    "The Cat in the Hat": 36,
    "Hogwarts Express - Hogsmeade Station": 0,  
    "Camp Jurassic": 0,
    "Jurassic Park Discovery Center": 0,
    "Jurassic World Velocicoaster": 51,
    "The Amazing Adventures of Spider-Man®": 40,
    
}

def prompt_user_preferences(rides):
    """
    Given a list of ride names, prompt user for a preference rating (1-5).
    Returns a dict: { ride_name: preference (int) }
    """
    print("Please rate each ride from 1 (frown) to 5 (happy).")
    user_prefs = {}

    for ride_name in rides:
        while True:
            print(f"\nRide: {ride_name}")
            rating_str = input("Enter preference [1-5]: ")
            try:
                rating = int(rating_str)
                if 1 <= rating <= 5:
                    user_prefs[ride_name] = rating
                    break
                else:
                    print("Please enter a number between 1 and 5.")
            except ValueError:
                print("Invalid input. Please enter a valid integer.")
    return user_prefs

def filter_by_height(rides_with_waits, user_height):
    """
    Given a list of (ride_name, wait_time) and user height,
    return only those rides user can ride based on IOA_RIDE_HEIGHTS.
    """
    filtered = []
    for ride_name, wait_time in rides_with_waits:
        min_height = IOA_RIDE_HEIGHTS.get(ride_name, 0)  # default 0 if unknown
        if user_height >= min_height:
            filtered.append((ride_name, wait_time))
    return filtered

def pick_best_ride(rides_with_waits, user_prefs):
    """
    Given a list of (ride_name, wait_time) and a dict of user preferences,
    find the ride that has:
      - The highest preference rating
      - Among those, the shortest wait time
    Returns a tuple: (best_ride_name, best_wait_time, best_pref)
    """

    # Sort by preference DESC, then wait_time ASC
    # i.e., we want to pick the top preference ride that also has the shortest line
    # If user_prefs doesn't have a ride rated, treat it as 0 or skip.

    # 1) Build a combined structure for sorting
    combined = []
    for ride_name, wait_time in rides_with_waits:
        pref = user_prefs.get(ride_name, 0)
        combined.append((ride_name, wait_time, pref))

    # 2) Sort: first by preference (descending), then by wait_time (ascending)
    # Combined sort key: (-pref, wait_time)
    combined.sort(key=lambda x: (-x[2], x[1]))

    # 3) The best ride is now the first in sorted list (if any)
    if len(combined) == 0:
        return None, None, None

    best_ride_name, best_wait, best_pref = combined[0]
    return best_ride_name, best_wait, best_pref

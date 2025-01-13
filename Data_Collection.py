import requests

def list_parks():
    """Fetches and returns JSON data of all park groups from Queue-Times."""
    url = "https://queue-times.com/parks.json"
    response = requests.get(url)
    response.raise_for_status()
    return response.json()

def get_park_queue_times(park_id):
    """
    Given a park_id (int), fetches the queue times (lands & rides)
    from the Queue Times API.
    """
    url = f"https://queue-times.com/parks/{park_id}/queue_times.json"
    response = requests.get(url)
    response.raise_for_status()
    return response.json()

def main():
    print("Powered by Queue-Times.com\n")

    # Step 1: Optional - List all parks to find the correct ID
    # You can comment out once you've identified your park's ID.
    # all_parks = list_parks()
    # for group in all_parks:
    #     print(f"Group: {group['name']} (ID: {group['id']})")
    #     for park in group["parks"]:
    #         print(f"  Park: {park['name']} (ID: {park['id']})")
    # print("\n----- End of Park Listing -----\n")

    # Step 2: Provide the Park ID for Islands of Adventure (example)
    park_id = 64  # <-- Replace this with the actual ID you found

    # Step 3: Fetch queue data for that park
    queue_data = get_park_queue_times(park_id)

    # Step 4: Print a readable summary
    lands = queue_data.get("lands", [])
    print(f"Queue Times for Park ID: {park_id}")
    for land in lands:
        land_name = land["name"]
        print(f"\nLand: {land_name}")
        for ride in land["rides"]:
            ride_name = ride["name"]
            wait_time = ride["wait_time"]
            is_open = ride["is_open"]
            last_updated = ride["last_updated"]
            print(f"  Ride: {ride_name}")
            print(f"    Wait Time : {wait_time} min")
            print(f"    Is Open?  : {is_open}")
            print(f"    Updated   : {last_updated}\n")

if __name__ == "__main__":
    main()

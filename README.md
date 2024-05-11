# projet_api

GET

/rooms - get a list of all rooms

/rooms/:id - gets room with id :id

POST

/rooms - creates a new room
request has to look like:
{
    "name": "your_room_name",
    "description":  "your_description",
    "image": "your/path/to/image",
    "type": "your_type",
    "capacity": any number betweet 15 and 30
    "disabled_access": True/False (optional, default false)
}

DELETE

/rooms/:id - deletes room with id :id
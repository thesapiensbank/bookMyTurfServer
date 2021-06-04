# bookMyTurfServer

Url -> /turf/slots
Method -> POST
data -> 
{
    "date":"YYYY-MM-DD",
    "turftypeid":"60b91dd57a790e8e1338a09c"
}
response -> (oph-> available slots OR operating hours, turfbh-> turf booked hours)
{
    "slots": [
        "8 to 9",
        "9 to 10",
        "10 to 11",
        "11 to 12",
        "13 to 14",
        "14 to 15",
        "15 to 16",
        "16 to 17",
        "18 to 19",
        "19 to 20"
    ],
    "oph": [
        "8 to 9",
        "9 to 10",
        "10 to 11",
        "11 to 12",
        "12 to 13",
        "13 to 14",
        "14 to 15",
        "15 to 16",
        "16 to 17",
        "17 to 18",
        "18 to 19",
        "19 to 20"
    ],
    "turfbh": [
        "12 to 13",
        "17 to 18"
    ]
}

// 
(if turf not present )
res->Turf not found
//

URL-> /turf
Method -> GET
Load all turfs 
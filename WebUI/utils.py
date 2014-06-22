from operator import attrgetter

__author__ = 'prateek'

import math
from models import *
import datetime
import json

def distance(origin, destination):
    lat1 = origin[0]
    lon1 = origin[1]
    lat2 = destination[0]
    lon2 = destination[1]
    radius = 6371 # km

    dlat = math.radians(lat2-lat1)
    dlon = math.radians(lon2-lon1)
    a = math.sin(dlat/2) * math.sin(dlat/2) + math.cos(math.radians(lat1)) \
        * math.cos(math.radians(lat2)) * math.sin(dlon/2) * math.sin(dlon/2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    d = radius * c

    return d


def clusterize_latlngs(cordinates, total_distance):
    clusters = []
    reference = cordinates[0]
    clusters+=[reference]
    for i in xrange(1,len(cordinates)-1):
        if distance(reference, cordinates[i])>1:
            reference = cordinates[i]
            clusters+=[reference]
    clusters+=[cordinates[-1]]

    return clusters

def search(cords, time, radius):
    trips = Trip.objects.filter(time__gte=time - datetime.timedelta(hours=1), time__lte=time + datetime.timedelta(hours=1))
    matched_trips = []
    for trip in trips:
        matches = 0
        points = json.loads(trip.cluster)
        for point in points:
            if ( distance(cords[matches],point) < radius):
                matches+=1
                print "Yay"
                if (matches==2):
                    matched_trips+=[trip]
                    break

    matched_trips = sorted(matched_trips, key=attrgetter('time'))
    print matched_trips
    return matched_trips
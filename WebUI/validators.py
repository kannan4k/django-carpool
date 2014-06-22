__author__ = 'prateek'

from django.core.exceptions import ValidationError
from datetime import timedelta, date

def ContactNumberValidator(value):
    if value < 1000000000 or value > 10000000000:
        raise ValidationError(u'%s is not a valid Contact Number' % value)


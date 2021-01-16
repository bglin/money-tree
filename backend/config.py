import os


class Config(object):
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'super-secret-hidden-key'
    ## str(os.urandom(16))

    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')

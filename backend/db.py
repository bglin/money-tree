from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.ext.automap import automap_base

from config import Config



engine = create_engine("mysql+mysqldb://bglin:Myrpg!!12@localhost/portal")
# db=MySQLdb.connect(host="localhost",user="bglin",passwd="Myrpg!!12",db="portal")

db_session = scoped_session(sessionmaker(bind = engine))

Base = automap_base()
Base.prepare(engine, reflect = True)

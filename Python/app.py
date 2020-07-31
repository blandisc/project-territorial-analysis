import datetime as dt
import numpy as np
import pandas as pd

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
from database import host,port,username,password,db

from flask import Flask, jsonify

#################################################
# Database Setup
#################################################
engine = create_engine(f"postgresql+psycopg2://{username}:{password}@{host}/{db}")

Base = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)

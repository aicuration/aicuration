 
from sqlalchemy import Column, Integer, String, Text, DECIMAL, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class Theme(Base):
    __tablename__ = "themes"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), nullable=False)
    description = Column(Text)
    icon_name = Column(String(100))
    color_code = Column(String(7), default="#007AFF")
    
    # 관계
    spots = relationship("Spot", back_populates="theme")

class Spot(Base):
    __tablename__ = "spots"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    theme_id = Column(Integer, ForeignKey("themes.id"))
    description = Column(Text)
    address = Column(Text)
    latitude = Column(DECIMAL(10, 8))
    longitude = Column(DECIMAL(11, 8))
    image_url = Column(Text)
    operating_hours = Column(Text)
    contact_info = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # 관계
    theme = relationship("Theme", back_populates="spots")
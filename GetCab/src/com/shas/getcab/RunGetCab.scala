package com.shas.getcab
import org.apache.spark._
import org.apache.spark.streaming._
import org.apache.spark.rdd.RDD

object RunGetCab {
  case class Location(lat: Float, long: Float)
  def updateLoc(newLoc: Seq[Location], updtLoc: Option[Location]) = {
    Some(newLoc(0))
  }
  def getNearest(custLocRdd: RDD[(String,Location)], cptnLocRdd: RDD[(String,Location)]) = {
	  //check if cust Loc not empty
	  if(!custLocRdd.isEmpty){
		  //cartestian join updated state and cust loc
		  val custCaptRdd = custLocRdd.cartesian(cptnLocRdd)
			//calculate distance
		  custCaptRdd.map{case((custId,custLoc),(cptnId,cptnLoc)) => {
		    val latDif = custLoc.lat - cptnLoc.lat
		    val longDif = custLoc.long - cptnLoc.long
		    val dist = math.sqrt(math.pow(latDif,2) + math.pow(longDif,2)) 
		    (custId,cptnId,dist)
		  }}
	  }else
	    custLocRdd.map(l => ("0","0",0.toDouble))
  }
  def main(args: Array[String]){
    val chkPntFile = args(0)
    val conf = new SparkConf().setAppName("GetCab").setMaster("local[*]")
    val ssc = new StreamingContext(conf,Seconds(1))
    ssc.checkpoint(chkPntFile)
    //get captain locations from stream
    val cptnLocStream = ssc.socketTextStream("localhost",3000)
    val newCptnLoc = cptnLocStream.map(_.split(","))
                          .map(data => (data(0),Location(data(1).toFloat,data(2).toFloat)))
    //update recent captain location
    val cptnLoc = newCptnLoc.updateStateByKey[Location](updateLoc _)
    //get customer locations from stream
    val custLocStream = ssc.socketTextStream("localhost",3001)
    val custLoc = custLocStream.map(_.split(","))
                          .map(data => (data(0),Location(data(1).toFloat,data(2).toFloat)))                         
    custLoc.transformWith(cptnLoc,getNearest _).print()
    
    //sort by distance 
    
    ssc.start()
    ssc.awaitTermination()
  }
}
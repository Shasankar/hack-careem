package com.shas.getcab
import kafka.serializer.StringDecoder
import org.apache.spark._
import org.apache.spark.streaming._
import org.apache.spark.rdd.RDD
import org.apache.spark.streaming.kafka._

object RunGetCab {
  case class Location(lat: Float, long: Float)
  
  //function to update latest cptn state
  def updateLoc(newLoc: Seq[Location], updtLoc: Option[Location]) = {
    var latestLoc=newLoc.lastOption.getOrElse(updtLoc.get)
    Some(latestLoc)
  }
  
  //function to calculate distance between each customer n cptn 
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
  
  //main
  def main(args: Array[String]){
    if(args.length < 3){
      System.err.println(s"""
        |Usage: RunGetCab <> <chkPntFile> <master>
        | <chkPntFile> is full path to checkpoint file
        | <> is ...
    		| <master> is the SparkMaster
        |
        """.stripMargin)
      System.exit(1)
    }
    val chkPntFile = args(0)
    val conf = new SparkConf().setAppName("GetCab").setMaster("local[*]")
    val ssc = new StreamingContext(conf,Seconds(60))
    ssc.checkpoint(chkPntFile)
    
    //get captain locations from stream
    //val cptnLocStream = ssc.socketTextStream("localhost",3000)
    val cptnTopics = Set("cptnLoc")
    val kafkaParams = Map[String,String]("metadata.broker.list"->"localhost:9092")
    val cptnLocStream = KafkaUtils.createDirectStream[String,String,StringDecoder,StringDecoder](ssc,kafkaParams,cptnTopics)
    val newCptnLoc = cptnLocStream.map(_._2.split(","))
                          .map(data => (data(0),Location(data(1).toFloat,data(2).toFloat)))
                          
    //update recent captain location
    val cptnLoc = newCptnLoc.updateStateByKey[Location](updateLoc _)
    
    //get customer locations from stream
    //val custLocStream = ssc.socketTextStream("localhost",3001)
    val custTopics = Set("custLoc")
    val custLocStream = KafkaUtils.createDirectStream[String,String,StringDecoder,StringDecoder](ssc,kafkaParams,custTopics)
    val custLoc = custLocStream.map(_._2.split(","))
                          .map(data => (data(0),Location(data(1).toFloat,data(2).toFloat)))   
                          
    //calculate distance between each customer n cptn                          
    custLoc.transformWith(cptnLoc,getNearest _).print()
    
    //sort by distance 
    
    ssc.start()
    ssc.awaitTermination()
  }
}
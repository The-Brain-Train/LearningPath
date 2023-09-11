package com.braintrain.backend.roadMaps;

import com.braintrain.backend.Person;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface RoadMapRepository  extends MongoRepository<RoadMapMeta, String> {


}

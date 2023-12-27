package com.braintrain.backend.util;

import com.braintrain.backend.model.RoadmapMeta;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import javax.annotation.PostConstruct;
import java.time.LocalDateTime;

@Configuration
public class MongoFieldUpdater {
    @Autowired
    private MongoTemplate mongoTemplate;

    @Value("${field.updater.enabled}")
    private boolean fieldUpdaterEnabled;

    @PostConstruct
    public void initialize() {
        if (fieldUpdaterEnabled) {
            Query query = new Query(Criteria.where("createdDate").exists(false));
            Update update = new Update().set("createdDate", LocalDateTime.now());
            mongoTemplate.updateMulti(query, update, RoadmapMeta.class);
        }
    }
}

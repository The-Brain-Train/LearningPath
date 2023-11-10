package com.braintrain.backend.util;

import com.braintrain.backend.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

import javax.annotation.PostConstruct;
import java.util.ArrayList;

@Configuration
public class MongoFieldUpdater {
    @Autowired
    private MongoTemplate mongoTemplate;

    @Value("${field.updater.enabled}")
    private boolean fieldUpdaterEnabled;

    @PostConstruct
    public void initialize() {
        if (fieldUpdaterEnabled) {
            Query query = new Query(
                    Criteria.where("upVotes").exists(false)
                            .and("downVotes").exists(false)
            );
            Update update = new Update()
                    .set("upVotes", new ArrayList<>())
                    .set("downVotes", new ArrayList<>());

            mongoTemplate.updateMulti(query, update, User.class);
        }
    }
}

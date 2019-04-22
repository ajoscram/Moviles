package com.example.mobile_rest;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.widget.Toast;

public class Details extends AppCompatActivity {

    String nameT;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_details);

            nameT = getIntent().getStringExtra("nombre");
        Toast.makeText(getApplicationContext(),nameT, Toast.LENGTH_LONG).show();
    }
}

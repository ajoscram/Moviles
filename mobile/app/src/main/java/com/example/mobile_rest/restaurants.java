package com.example.mobile_rest;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Adapter;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.ListAdapter;
import android.widget.ListView;
import android.widget.Toast;

import java.util.ArrayList;

public class restaurants extends AppCompatActivity {

    //ArrayList<String> sRest ;
    //ArrayList<String> tRest ;
    Adapter adaptadorRestaurante;
    ListView lvRest;
    int pos;
    public ArrayList<String> sRest = new ArrayList<>();
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_restaurants);







        lvRest = (ListView)findViewById(R.id.listaRest);






        //lvRest.setAdapter((ListAdapter) adaptadorRestaurante);

        sRest.add("Judalu");
        sRest.add("Burger King");

        sRest.add("Pizza Hut");
        Toast.makeText(getApplicationContext(),String.valueOf(sRest.size()), Toast.LENGTH_LONG).show();
        show (sRest);





                lvRest.setOnItemClickListener(new AdapterView.OnItemClickListener() {
                    @Override
                    public void onItemClick(AdapterView<?> parent, View view, int posicion, long id) {
                        int idRest;
                        String nombre="bk";
                       nombre = sRest.get(posicion);
                        nextW(nombre);


                    }
                });

    }











    public void nextW(String nameR){

        // Toast.makeText(this, posicion, Toast.LENGTH_SHORT).show();

        Intent siguiente = new Intent( this,Details.class);

        // envia un parametros
        siguiente.putExtra("nombre",nameR);



        startActivity(siguiente);

    }


    public  void  show(ArrayList list){
        adaptadorRestaurante = new ArrayAdapter(this,android.R.layout.simple_list_item_1, list);
        lvRest.setAdapter((ListAdapter) adaptadorRestaurante);



    }







}

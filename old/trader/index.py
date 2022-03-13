from ast import IfExp
import sys
import os.path
import math
import investpy as invest
import pandas as pd
import backtrader as bt
import backtrader.feeds as backtraderfeed
from datetime import date
import datetime

from strategies import *
from brokers import *


def printSQN(analyzer):
    sqn = round(analyzer.sqn, 2)
    print('SQN: {}'.format(sqn))


def main():
    description = False
    currentCash = 99990
    comissions = 0.005
    fromDate = '01/11/2021'
    stock = 'VND'
    today = date.today().strftime("%d/%m/%Y")
    #dataFromStock = getData(stock, fromDate, today)
    #exportData(dataFromStock, 'data.csv')

    cerebro = bt.Cerebro(stdstats=description)
    data = backtraderfeed.GenericCSVData(
        dataname='data.csv',
        fromdate=datetime.datetime.strptime(fromDate, '%d/%m/%Y'),
        todate=date.today(),
        nullvalue=0.0,
        dtformat=('%Y-%m-%d'),
        datetime=0,
        open=1,
        high=2,
        low=3,
        close=4,
        volume=5,
        openinterest=-1
    )
    cerebro.adddata(data)
    # Set the Cash for the Strategy

    # cerebro.addstrategy(PrintClose)
    # cerebro.addstrategy(SimpleMA)
    # cerebro.addstrategy(EMAStack)
    # cerebro.addstrategy(SMA)

    # Add the Broker
    cerebro.addobserver(MyBuySell, barplot=True)
    cerebro.addstrategy(MACrossOver)

    cerebro.addsizer(bt.sizers.FixedSize)
    cerebro.addobserver(bt.observers.Value)
    cerebro.addobserver(bt.observers.DrawDown)

    cerebro.broker.setcash(currentCash)
    cerebro.broker.set_checksubmit(False)
    cerebro.broker.setcommission(commission=comissions)
    print('Starting Portfolio Value: %.2f' % cerebro.broker.getvalue())

    cerebro.addanalyzer(bt.analyzers.TradeAnalyzer, _name='TradeAnalyzer')
    #cerebro.addanalyzer(bt.analyzers.Transactions, _name='Transactions')
    cerebro.addanalyzer(bt.analyzers.PositionsValue, _name='PositionsValue')
    cerebro.addanalyzer(bt.analyzers.DrawDown, _name='DrawDown')

    results = cerebro.run()
    strat = results[0]

    # Print out the final result
    print('Final Portfolio Value: %.2f' % cerebro.broker.getvalue())

    #cerebro.plot(style='candlestick', barup='gray', bardown='pink')
    cerebro.plot(style='ohlc', barup='green', bardown='red')

    return 0


def getData(symbol, start, end):
    data = invest.get_stock_historical_data(
        stock=symbol, country='VietNam', from_date=start, to_date=end)
    return data


def exportData(data, filename):
    pd.DataFrame(data).to_csv(filename)
    print('>> Data exported to ' + filename)


def pretty_print(format, *args):
    print(format.format(*args))


def printTradeAnalysis(cerebro, analyzers):
    format = "  {:<24} : {:<24}"
    NA = '-'

    print('Backtesting Results')
    if hasattr(analyzers, 'ta'):
        ta = analyzers.ta.get_analysis()

        openTotal = ta.total.open if(ta, 'total', 'open') else None
        closedTotal = ta.total.closed if(
            ta, 'total', 'closed') else None
        wonTotal = ta.won.total if(ta, 'won',   'total') else None
        lostTotal = ta.lost.total if(ta, 'lost',  'total') else None

        streakWonLongest = ta.streak.won.longest if(
            ta, 'streak', 'won',  'longest') else None
        streakLostLongest = ta.streak.lost.longest if(
            ta, 'streak', 'lost', 'longest') else None

        pnlNetTotal = ta.pnl.net.total if(
            ta, 'pnl', 'net', 'total') else None
        pnlNetAverage = ta.pnl.net.average if(
            ta, 'pnl', 'net', 'average') else None

        pretty_print(format, 'Open Positions', openTotal or NA)
        pretty_print(format, 'Closed Trades',  closedTotal or NA)
        pretty_print(format, 'Winning Trades', wonTotal or NA)
        pretty_print(format, 'Loosing Trades', lostTotal or NA)
        print('\n')

        pretty_print(format, 'Longest Winning Streak',
                     streakWonLongest or NA)
        pretty_print(format, 'Longest Loosing Streak',
                     streakLostLongest or NA)
        pretty_print(format, 'Strike Rate (Win/closed)', (wonTotal /
                     closedTotal) * 100 if wonTotal and closedTotal else NA)
        print('\n')

        pretty_print(format, 'Inital Portfolio Value', '${}'.format(icap))
        pretty_print(format, 'Final Portfolio Value',
                     '${}'.format(cerebro.broker.getvalue()))
        pretty_print(format, 'Net P/L',
                     '${}'.format(round(pnlNetTotal,   2)) if pnlNetTotal else NA)
        pretty_print(format, 'P/L Average per trade',
                     '${}'.format(round(pnlNetAverage, 2)) if pnlNetAverage else NA)
        print('\n')

    if hasattr(analyzers, 'drawdown'):
        pretty_print(format, 'Drawdown', '${}'.format(
            analyzers.drawdown.get_analysis()['drawdown']))
    if hasattr(analyzers, 'sharpe'):
        pretty_print(format, 'Sharpe Ratio:',
                     analyzers.sharpe.get_analysis()['sharperatio'])
    if hasattr(analyzers, 'vwr'):
        pretty_print(format, 'VRW', analyzers.vwr.get_analysis()['vwr'])
    if hasattr(analyzers, 'sqn'):
        pretty_print(format, 'SQN', analyzers.sqn.get_analysis()['sqn'])
    print('\n')

    print('Transactions')
    format = "  {:<24} {:<24} {:<16} {:<8} {:<8} {:<16}"
    pretty_print(format, 'Date', 'Amount', 'Price', 'SID', 'Symbol', 'Value')
    for key, value in analyzers.txn.get_analysis().items():
        pretty_print(format, key.strftime("%Y/%m/%d %H:%M:%S"),
                     value[0][0], value[0][1], value[0][2], value[0][3], value[0][4])


if __name__ == "__main__":
    sys.exit(main())
